from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from routes_employees import router as employees_router
from routes_erklaerung_form import router as erklaerung_form_router
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