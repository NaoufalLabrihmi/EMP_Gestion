from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from routes_employees import router as employees_router
from routes_erklaerung_form import router as erklaerung_form_router
from routes_einkommensbescheinigung import router as einkommensbescheinigung_router
from routes_company import router as company_router

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# CORS setup (adjust origins as needed)
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees_router)
app.include_router(erklaerung_form_router)
app.include_router(einkommensbescheinigung_router)
app.include_router(company_router)

@app.get("/")
def root():
    return {"status": "ok"}
