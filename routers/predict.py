from fastapi import APIRouter, HTTPException, status, Depends
from models.prediction_models import UserInput, PredictionResponse
from ml_model.model_loader import loan_predictor
from utils.auth_utils import get_current_user
from configerDB import predictions_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post("/", response_model=PredictionResponse)
async def predict_loan(
    data: UserInput,
    current_user: dict = Depends(get_current_user)  # This protects the endpoint
):
    """Predict loan approval probability (Authentication Required)"""
    try:
        # Prepare input data for model
        input_dict = {
            "loan_percent_income": data.loan_percent_income,
            "loan_int_rate": data.loan_int_rate,
            "person_home_ownership_RENT": data.person_home_ownership_RENT,
            "loan_amnt": data.loan_amnt,
            "person_income": data.person_income,
            "previous_loan_defaults_on_file": int(not data.previous_loan_defaults_on_file)
        }
        
        # Make prediction
        prediction_result = loan_predictor.predict(input_dict)
        
        # Prepare response
        response = PredictionResponse(
            probability=prediction_result["probability"],
            prediction=prediction_result["prediction"],
            prediction_numeric=prediction_result["prediction_numeric"],
            features_used=input_dict,
            timestamp=datetime.utcnow()
        )
        
        # Save prediction to database (optional)
        prediction_doc = {
            "user_id": str(current_user["_id"]),
            "user_email": current_user["email"],
            "prediction_data": input_dict,
            "result": response.dict(),
            "created_at": datetime.utcnow()
        }
        
        predictions_collection.insert_one(prediction_doc)
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@router.get("/history")
async def get_prediction_history(current_user: dict = Depends(get_current_user)):
    """Get user's prediction history (Authentication Required)"""
    try:
        predictions = list(predictions_collection.find(
            {"user_id": str(current_user["_id"])}
        ).sort("created_at", -1).limit(50))
        
        # Convert ObjectId to string
        for pred in predictions:
            pred["_id"] = str(pred["_id"])
        
        return {"predictions": predictions}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch prediction history: {str(e)}"
        )