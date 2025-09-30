from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

# Import routers
from routers.auth import router as auth_router
from routers.predict import router as predict_router

# Import middleware
from middlewares.cors import add_cors_middleware

# Import ML model loader to initialize it
from ml_model.model_loader import loan_predictor

# Create FastAPI app
app = FastAPI(
    title="Loan Approval API",
    description="API for loan approval prediction and user authentication",
    version="1.0.0"
    # REMOVED: dependencies=[Depends(security_scheme)]
)

# Add CORS middleware
add_cors_middleware(app)

# Include routers
app.include_router(auth_router)
app.include_router(predict_router)

@app.get("/")
async def root():
    return {"message": "Loan Approval API is running 🚀"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "API is running smoothly",
        "database": "Connected" if loan_predictor.model is not None else "Error"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )