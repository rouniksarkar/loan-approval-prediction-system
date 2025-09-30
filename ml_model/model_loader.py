import joblib
import pandas as pd
import numpy as np
import os

class LoanPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.selected_cols = None
        self.all_features = None
        self.load_models()
    
    def load_models(self):
        """Load the trained model and preprocessing objects"""
        try:
            # Load model and preprocessing objects
            self.model = joblib.load("model_loan_final.pkl")
            self.scaler = joblib.load("scaler_loan_final.pkl")
            self.selected_cols = joblib.load("selected_columns_final.pkl")
            self.all_features = joblib.load("all_features_final.pkl")
            print("✅ ML models loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            raise
    
    def preprocess_input(self, input_dict: dict):
        """Preprocess input data for prediction"""
        # Create full feature DataFrame with zeros
        input_full = pd.DataFrame({col: [0] for col in self.all_features})
        
        # Fill in the provided features
        for col, value in input_dict.items():
            if col in input_full.columns:
                input_full[col] = value
        
        # Apply log transformation to specific columns
        for col in ['loan_amnt', 'person_income']:
            if col in input_full.columns:
                input_full[col] = np.log1p(input_full[col])
        
        # Scale the features
        input_scaled_array = self.scaler.transform(input_full)
        input_scaled = pd.DataFrame(input_scaled_array, columns=self.all_features)
        
        # Select only the required features
        input_final = input_scaled[self.selected_cols]
        
        return input_final
    
    def predict(self, input_data: dict):
        """Make prediction on input data"""
        try:
            # Preprocess input
            processed_input = self.preprocess_input(input_data)
            
            # Make prediction
            y_proba = self.model.predict_proba(processed_input)[:, 1][0]
            
            # Apply threshold
            THRESHOLD = 0.6
            y_pred = 1 if y_proba >= THRESHOLD else 0
            
            return {
                "probability": float(y_proba),
                "prediction": "Approved" if y_pred == 0 else "Rejected",
                "prediction_numeric": y_pred
            }
            
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            raise

# Global instance
loan_predictor = LoanPredictor()