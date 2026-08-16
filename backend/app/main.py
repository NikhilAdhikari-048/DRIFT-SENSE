from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import WaferInput, RecoveryInput
from .services.model_service import predict_correction
from .services.recovery_service import recover_wafer
from .services.diagnostics_service import diagnose

app = FastAPI(
    title="AI Wafer Navigation Recovery",
    description="Backend API for AI-based wafer navigation and recovery",
    version="1.0.0"
)

# ADD THIS PART
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "AI Wafer Navigation Recovery API is running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.post("/predict")
def predict(data: WaferInput):
    result = predict_correction(data.model_dump())

    return {
        "prediction": result
    }

@app.post("/recover")
def recover(data: RecoveryInput):
    result = recover_wafer(data.model_dump())

    return result

@app.post("/diagnose")
def diagnostics(data: RecoveryInput):
    result = diagnose(data.model_dump())

    return {
        "diagnostics": result
    }