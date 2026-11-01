# Indosat Customer Churn ML Prediction Service

This directory contains the Python FastAPI backend service to serve predictions using the trained `churn_logistic_regression_smote.pkl` model.

## Features Handled (13 Features)
- **Numerical (4)**: `tenureMonths`, `monthlyCharges`, `age`, `total_support_interactions`
- **Categorical (9)**: `hasPhoneService`, `hasInternetService`, `contractType`, `paperlessBilling`, `paymentMethod`, `region`, `gender`, `partner`, `dependents`

## Running Locally

1. Place your `churn_logistic_regression_smote.pkl` file in this directory (or root).
2. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch the FastAPI service:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
4. In the web platform, the application connects to `http://localhost:8000/predict` (or set `CHURN_API_URL` in `.env`).
