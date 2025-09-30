# Loan Approval Prediction System

A full-stack machine learning project that predicts whether a loan should be approved based on applicant details.  
This project uses **FastAPI (backend)**, **React + Vite (frontend)**, and **MongoDB Atlas (database)**.  
Machine learning models are trained in Python and stored as `.pkl` files.

---

## 🚀 Tech Stack
- **Machine Learning**: Scikit-learn, Pickle
- **Backend**: FastAPI
- **Frontend**: React.js (Vite)
- **Database**: MongoDB Atlas (Cloud NoSQL)
- **Authentication**: JWT

---

## 📂 Project Structure
Loan Approval Model/
│
├── Frontend/ # React (Vite) frontend
│   └── Get_Loan/
│       ├── package.json
│       ├── src/
│       │   ├─ components/
│       │   │  ├─ auth/
│       │   │  │  ├─ Login.jsx
│       │   │  │  └─ SignUp.jsx
│       │   │  ├─ common/
│       │   │  │  ├─ Navbar.jsx
│       │   │  │  └─ PredictRoute.jsx
│       │   │  ├─ home/
│       │   │  │  └─ HomePage.jsx
│       │   │  └─ prediction/
│       │   │     └─ PredictForm.jsx
│       │   ├─ services/
│       │   │  ├─ api.js
│       │   │  └─ auth.js
│       │   ├─ utils/
│       │   │  └─ constants.js
│       │   ├─ App.jsx
│       │   └─ main.jsx
│       └── README.md
│
├── backend files (root) # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   ├── models/ # DB schemas
│   ├── routers/ # API routes
│   ├── ml_model/ # ML .pkl models
│   ├── utils/ # Utility functions
│   └── middlewares/ # cor
│
├── .gitignore
├── README.md # Main project documentation
└── .env (ignored)

