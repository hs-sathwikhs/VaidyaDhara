# backend/app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import pandas as pd
import sqlite3
import sys
import io
from typing import List, Dict, Any, Optional # Import Optional

# Fix Unicode printing issues on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

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

class SymptomRequest(BaseModel):
    symptoms: List[str]
    duration: Optional[str] = None
    intensity: Optional[str] = None
    location: Optional[str] = None
    language: str = "en"

class SymptomResponse(BaseModel):
    suggestions: List[str]
    urgency: str
    disclaimer: str

class HealthTip(BaseModel):
    id: int
    title: str
    description: str
    category: str
    points: int

class HealthTipsResponse(BaseModel):
    tips: List[HealthTip]

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
    allow_origins=["*"],  # More permissive for debugging
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
    try:
        session_id = "default_user" # Using a static user for this prototype
        # Safe printing with Unicode handling
        try:
            print(f"Received chat request in language: {request.language}")
        except:
            pass  # Ignore print errors
        
        # Prepare language-aware question
        language_names = {
            "en": "English",
            "hi": "Hindi", 
            "or": "Odia", 
            "bn": "Bengali", 
            "te": "Telugu", 
            "ta": "Tamil", 
            "kn": "Kannada"
        }
        
        if request.language != "en":
            lang_name = language_names.get(request.language, "English")
            # Add clear language instruction to the query
            enhanced_question = f"Please respond in {lang_name} language. User's health question: {request.question}. Remember to write your entire response in {lang_name}."
        else:
            enhanced_question = request.question
        
        # Safe printing
        try:
            print(f"Processing request in language: {request.language}")
        except:
            pass
        
        try:
            response_text = ai_engine.get_ai_response(enhanced_question, session_id=session_id)
            # Safe printing
            try:
                print(f"AI response received successfully")
            except:
                pass
        except Exception as ai_error:
            print(f"AI Engine error: {str(ai_error)}")
            response_text = "I'm having trouble understanding your request. Please try rephrasing it or try again later."
        
        database.log_query(
            query_text=request.question,
            response_text=response_text,
            language=request.language,
            location_tag=request.location
        )
        
        # Award 10 points for each interaction
        new_total_points = database.add_points_to_user(user_id=session_id, points_to_add=10)
        # Safe printing
        try:
            print(f"User points: {new_total_points}")
        except:
            pass
        
        return ChatResponse(answer=response_text, points=new_total_points)
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return a fallback response instead of raising error
        return ChatResponse(
            answer="I apologize, but I'm experiencing technical difficulties. Please try again later.",
            points=0
        )

@app.post("/api/chat/clear-session")
async def clear_chat_session():
    """Clear the current chat session to reset symptom checker state"""
    session_id = "default_user"
    ai_engine.clear_session(session_id)
    return {"status": "session cleared"}

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

@app.post("/api/symptoms/check", response_model=SymptomResponse)
async def check_symptoms(request: SymptomRequest):
    """Enhanced symptom checker endpoint that provides structured analysis"""
    
    # Create a detailed query for the AI
    symptoms_text = ", ".join(request.symptoms)
    detailed_query = f"Based on these symptoms: {symptoms_text}"
    
    if request.duration:
        detailed_query += f" (duration: {request.duration})"
    if request.intensity:
        detailed_query += f" (intensity: {request.intensity})"
    
    detailed_query += ". What health conditions could cause these symptoms? Please provide information from your knowledge base about possible conditions, their characteristics, when to seek medical care, and any preventive measures. If these symptoms match any specific diseases in your knowledge base, please provide detailed information about them."
    
    # Get AI response
    if request.language != "en":
        language_names = {"hi": "Hindi", "or": "Odia", "bn": "Bengali", "te": "Telugu", "ta": "Tamil", "kn": "Kannada"}
        lang_name = language_names.get(request.language, "English")
        detailed_query = f"Please answer in {lang_name}: {detailed_query}"
    
    ai_response = ai_engine.get_ai_response(detailed_query, session_id="symptom_check", skip_symptom_check=True)
    
    # Parse response and determine urgency
    urgency = "medium"  # default
    
    # Simple urgency detection based on symptoms
    high_urgency_symptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'high fever', 'bleeding']
    low_urgency_symptoms = ['mild headache', 'slight cough', 'minor fatigue']
    
    symptoms_lower = [s.lower() for s in request.symptoms]
    
    if any(symptom in ' '.join(symptoms_lower) for symptom in high_urgency_symptoms):
        urgency = "high"
    elif any(symptom in ' '.join(symptoms_lower) for symptom in low_urgency_symptoms):
        urgency = "low"
    
    # Split AI response into suggestions
    suggestions = ai_response.split('\n')
    suggestions = [s.strip() for s in suggestions if s.strip()]
    
    if not suggestions:
        suggestions = ["Please consult a healthcare professional for proper evaluation of your symptoms."]
    
    disclaimer = "This analysis is for informational purposes only and does not replace professional medical advice. Always consult with qualified healthcare professionals for medical concerns."
    
    return SymptomResponse(
        suggestions=suggestions,
        urgency=urgency,
        disclaimer=disclaimer
    )

@app.get("/api/health-tips/daily", response_model=HealthTipsResponse)
async def get_daily_health_tips():
    """Get daily health tips for users"""
    tips = [
        HealthTip(
            id=1,
            title="Stay Hydrated Throughout the Day",
            description="Drink at least 8-10 glasses of water daily to maintain proper hydration. Water helps regulate body temperature, lubricates joints, and aids in digestion.",
            category="hydration",
            points=5
        ),
        HealthTip(
            id=2,
            title="The Power of 30-Minute Daily Walking",
            description="Regular walking for just 30 minutes can significantly improve cardiovascular health, strengthen bones, and boost mental well-being.",
            category="exercise",
            points=10
        ),
        HealthTip(
            id=3,
            title="Balanced Nutrition: The 5-Color Rule",
            description="Include fruits and vegetables of 5 different colors in your daily diet to ensure you get a wide variety of nutrients and antioxidants.",
            category="nutrition",
            points=15
        )
    ]
    
    return HealthTipsResponse(tips=tips)
