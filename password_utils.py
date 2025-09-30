from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os
import hashlib
from dotenv import load_dotenv

load_dotenv()

# Load from .env
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Use a more compatible password context
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256", "sha256_crypt", "bcrypt"], 
    deprecated="auto",
    pbkdf2_sha256__default_rounds=30000
)

def get_password_hash(password: str) -> str:
    """
    Safely hash password handling bcrypt limitations
    """
    # Convert to bytes to check length
    password_bytes = password.encode('utf-8')
    
    # If password is too long for bcrypt, use a different scheme
    if len(password_bytes) > 72:
        # Use pbkdf2_sha256 which doesn't have length limitations
        return pwd_context.hash(password, scheme="pbkdf2_sha256")
    else:
        # Try bcrypt, fallback to pbkdf2 if issues
        try:
            return pwd_context.hash(password)
        except Exception:
            return pwd_context.hash(password, scheme="pbkdf2_sha256")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password with the same scheme used for hashing
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create JWT access token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    """
    Decode and verify JWT token
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return None