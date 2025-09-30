from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from password_utils import decode_token  # Use the new utils
from configerDB import users_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency to get current user from JWT token
    """
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = users_collection.find_one({"email": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user