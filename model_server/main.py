"""
Customer Churn Intelligence Platform - Python FastAPI Model Prediction Service
Algorithm: Logistic Regression + SMOTE
Model file: churn_logistic_regression_smote.pkl
Features: 13 features (4 numerical, 9 categorical)
"""

import os
import joblib
import pandas as pd
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Indosat Customer Churn Prediction Service",
    description="FastAPI service serving the trained churn_logistic_regression_smote.pkl pipeline for Indosat",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.environ.get("MODEL_PATH", "churn_logistic_regression_smote.pkl")
pipeline = None

# Attempt to load model pipeline if present
if os.path.exists(MODEL_PATH):
    try:
        pipeline = joblib.load(MODEL_PATH)
        print(f"Successfully loaded trained model pipeline from {MODEL_PATH}")
    except Exception as e:
        print(f"Warning: Error loading {MODEL_PATH}: {e}")
else:
    print(f"Notice: {MODEL_PATH} not found in current directory. Put the file here or set MODEL_PATH.")

class CustomerInput(BaseModel):
    tenureMonths: int = Field(..., ge=1, le=72, description="Tenure in months (1-72)")
    monthlyCharges: float = Field(..., ge=150000, le=1000000, description="Monthly charges in IDR (150000-1000000)")
    age: int = Field(..., ge=19, le=72, description="Customer age (19-72)")
    total_support_interactions: int = Field(..., ge=0, le=2, description="Total support interactions (0-2)")
    hasPhoneService: str = Field(..., description="Phone service: 'Yes' or 'No'")
    hasInternetService: str = Field(..., description="Internet service: 'DSL', 'Fiber optic', or 'No'")
    gender: str = Field(..., description="Gender: 'Female' or 'Male'")
    partner: str = Field(..., description="'Yes' or 'No'")
    dependents: str = Field(..., description="'Yes' or 'No'")
    region: str = Field(..., description="Region: Bandung, JKT, Jakarta, Medan, SBY, Semarang, Surabaya, bandung, bdg, jakarta")
    contractType: str = Field(..., description="Contract: 'Month-to-month', 'One year', or 'Two year'")
    paperlessBilling: str = Field(..., description="'Yes' or 'No'")
    paymentMethod: str = Field(..., description="Payment method")

class PredictionResponse(BaseModel):
    churn_probability: float
    predicted_churn: int
    prediction_label: str
    risk_level: str
    prediction_horizon: str = "1 Month"
    classification_threshold: float = 0.50

@app.get("/")
def root():
    return {
        "service": "Indosat Customer Churn Prediction Service",
        "status": "online",
        "model_loaded": pipeline is not None,
        "model_file": MODEL_PATH,
        "endpoint": "/predict"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": pipeline is not None
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(customer: CustomerInput):
    if pipeline is None:
        raise HTTPException(
            status_code=503,
            detail=f"Model file '{MODEL_PATH}' is not loaded on this server. Please ensure churn_logistic_regression_smote.pkl exists."
        )

    # Construct DataFrame with exactly the expected 13 column names
    input_data = pd.DataFrame([{
        "tenureMonths": customer.tenureMonths,
        "monthlyCharges": customer.monthlyCharges,
        "age": customer.age,
        "total_support_interactions": customer.total_support_interactions,
        "hasPhoneService": customer.hasPhoneService,
        "hasInternetService": customer.hasInternetService,
        "gender": customer.gender,
        "partner": customer.partner,
        "dependents": customer.dependents,
        "region": customer.region,
        "contractType": customer.contractType,
        "paperlessBilling": customer.paperlessBilling,
        "paymentMethod": customer.paymentMethod
    }])

    try:
        # Get churn probability for positive class (1)
        prob = float(pipeline.predict_proba(input_data)[0, 1])
        predicted_class = int(prob >= 0.50)
        
        # Risk classification threshold
        if prob < 0.30:
            risk = "Low"
        elif prob < 0.70:
            risk = "Medium"
        else:
            risk = "High"

        return PredictionResponse(
            churn_probability=round(prob, 4),
            predicted_churn=predicted_class,
            prediction_label="Churn" if predicted_class == 1 else "Non-Churn",
            risk_level=risk,
            prediction_horizon="1 Month",
            classification_threshold=0.50
        )
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(err)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
