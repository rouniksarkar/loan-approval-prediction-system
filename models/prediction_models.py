from pydantic import BaseModel, Field
from typing import Literal, Annotated
from datetime import datetime

class UserInput(BaseModel):
    loan_percent_income: Annotated[float, Field(..., gt=0, lt=100, description="debt-to-income ratio")]
    loan_int_rate: Annotated[float, Field(..., gt=0, lt=100, description="Loan Interest ratio")]
    person_home_ownership_RENT: Annotated[int, Field(..., ge=0, le=1, description="1 if RENT, 0 otherwise")]
    loan_amnt: Annotated[float, Field(..., gt=0, description="Loan Amount")]
    person_income: Annotated[float, Field(..., gt=0, description="Monthly Income")]
    previous_loan_defaults_on_file: Annotated[bool, Field(..., description="There is any loan before")]

class PredictionResponse(BaseModel):
    probability: float
    prediction: Literal["Approved", "Rejected"]
    prediction_numeric: int
    features_used: dict
    timestamp: datetime

class PredictionHistory(BaseModel):
    user_id: str
    prediction_data: UserInput
    result: PredictionResponse
    created_at: datetime