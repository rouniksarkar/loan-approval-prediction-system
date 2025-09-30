from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from models.user_models import UserSignup, UserLogin, Token, UserResponse
from configerDB import users_collection
from utils.password_utils import get_password_hash, verify_password, create_access_token
from utils.auth_utils import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserSignup):
    """User registration endpoint"""
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }
        
        # Insert user
        result = users_collection.insert_one(user_doc)
        
        return UserResponse(
            id=str(result.inserted_id),
            email=user_data.email,
            created_at=user_doc["created_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """User login endpoint"""
    try:
        # Find user
        user = users_collection.find_one({"email": user_data.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verify password
        if not verify_password(user_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user["email"]},
            expires_delta=timedelta(minutes=30)
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            email=user["email"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information (Protected)"""
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        created_at=current_user["created_at"]
    )