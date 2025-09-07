# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import pandas as pd
import sqlite3
from typing import List, Dict, Any, Optional # Import Optional

from . import ai_engine, database

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    question: str
    language: str = "en"
    location: str = "Mysuru"

# --- MODIFIED: Add an optional points field to the response ---
class ChatResponse(BaseModel):
    answer: str
    points: Optional[int] = None

class LocationData(BaseModel):
    location: str
    count: int

class DashboardData(BaseModel):
    total_queries: int
    queries_by_location: List[LocationData]

# --- (lifespan, app initialization, and CORS sections remain the same) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application startup...")
    database.init_db()
    ai_engine.initialize_ai_engine()
    yield
    print("Application shutdown.")

app = FastAPI(
    title="Vaidya Dhara API",
    description="API for the AI-powered public health chatbot.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    conn = sqlite3.connect(database.DATABASE_NAME)
    try:
        yield conn
    finally:
        conn.close()

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "Vaidya Dhara Backend is running!"}

# --- MODIFIED: The chat endpoint now awards points ---
@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    session_id = "default_user" # Using a static user for this prototype
    response_text = ai_engine.get_ai_response(request.question, session_id=session_id)
    
    database.log_query(
        query_text=request.question,
        response_text=response_text,
        language=request.language,
        location_tag=request.location
    )
    
    # Award 10 points for each interaction
    new_total_points = database.add_points_to_user(user_id=session_id, points_to_add=10)
    
    return ChatResponse(answer=response_text, points=new_total_points)

@app.get("/api/dashboard-data", response_model=DashboardData)
def get_dashboard_data(conn: sqlite3.Connection = Depends(get_db_connection)):
    # (This function remains unchanged)
    df = pd.read_sql_query("SELECT * FROM query_logs", conn)
    total_queries = len(df)
    location_counts = df['location_tag'].value_counts().reset_index()
    location_counts.columns = ['location', 'count']
    queries_by_location = location_counts.to_dict('records')
    return DashboardData(
        total_queries=total_queries,
        queries_by_location=queries_by_location
    )