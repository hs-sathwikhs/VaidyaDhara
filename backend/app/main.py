# backend/app/main.py
from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import pandas as pd
import sqlite3
import tempfile
import os
from typing import List, Dict, Any, Optional # Import Optional

from . import ai_engine, database
from .document_analyzer import analyze_medical_document
from .health_gamification import get_health_scenario, submit_scenario_choice
from .knowledge_radar import analyze_user_knowledge, get_learning_recommendations
from .content_recommendations import get_health_content_recommendations, get_personalized_learning_content, content_engine

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

# Document Analysis Models
class DocumentAnalysisResponse(BaseModel):
    success: bool
    analysis: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Health Scenario Models
class HealthScenarioResponse(BaseModel):
    success: bool
    scenario: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class ScenarioChoiceRequest(BaseModel):
    scenario_id: str
    choice_index: int
    user_id: Optional[str] = None

class ScenarioChoiceResponse(BaseModel):
    success: bool
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Knowledge Analysis Models
class KnowledgeAnalysisRequest(BaseModel):
    user_id: str
    conversation_history: List[Dict[str, Any]]

class KnowledgeAnalysisResponse(BaseModel):
    success: bool
    analysis: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Content Recommendation Models
class ContentRecommendationRequest(BaseModel):
    topic: str
    category: Optional[str] = None
    content_type: Optional[str] = "video"

class ContentRecommendationResponse(BaseModel):
    success: bool
    recommendations: List[Dict[str, Any]]
    error: Optional[str] = None

class PersonalizedContentRequest(BaseModel):
    knowledge_gaps: List[Dict[str, Any]]
    user_preferences: Optional[Dict[str, Any]] = None

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

# Document Analysis Endpoint
@app.post("/api/analyze-document", response_model=DocumentAnalysisResponse)
async def analyze_document(file: UploadFile = File(...)):
    """
    Analyze uploaded medical document for concerning clauses and provide insights
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.txt')):
            return DocumentAnalysisResponse(
                success=False,
                error="Only PDF and TXT files are supported"
            )
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Analyze the document
            analysis_result = analyze_medical_document(tmp_file_path)
            
            return DocumentAnalysisResponse(
                success=True,
                analysis=analysis_result
            )
        
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    except Exception as e:
        return DocumentAnalysisResponse(
            success=False,
            error=f"Document analysis failed: {str(e)}"
        )

# Health Gamification Endpoints
@app.get("/api/health-scenario", response_model=HealthScenarioResponse)
def get_health_scenario_endpoint(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    user_id: Optional[str] = None
):
    """
    Get a random health scenario for gamification
    """
    try:
        result = get_health_scenario(category, difficulty, user_id)
        
        if "error" in result:
            return HealthScenarioResponse(
                success=False,
                error=result["error"]
            )
        
        return HealthScenarioResponse(
            success=True,
            scenario=result["scenario"]
        )
    
    except Exception as e:
        return HealthScenarioResponse(
            success=False,
            error=f"Failed to get health scenario: {str(e)}"
        )

@app.post("/api/submit-scenario-choice", response_model=ScenarioChoiceResponse)
def submit_scenario_choice_endpoint(request: ScenarioChoiceRequest):
    """
    Submit user's choice for a health scenario and get feedback
    """
    try:
        result = submit_scenario_choice(
            request.scenario_id, 
            request.choice_index, 
            request.user_id
        )
        
        if "error" in result:
            return ScenarioChoiceResponse(
                success=False,
                error=result["error"]
            )
        
        return ScenarioChoiceResponse(
            success=True,
            result=result["result"]
        )
    
    except Exception as e:
        return ScenarioChoiceResponse(
            success=False,
            error=f"Failed to submit scenario choice: {str(e)}"
        )

# Knowledge Analysis Endpoints
@app.post("/api/analyze-knowledge", response_model=KnowledgeAnalysisResponse)
def analyze_knowledge_endpoint(request: KnowledgeAnalysisRequest):
    """
    Analyze user's health knowledge and identify gaps
    """
    try:
        analysis_result = analyze_user_knowledge(
            request.user_id,
            request.conversation_history
        )
        
        return KnowledgeAnalysisResponse(
            success=True,
            analysis=analysis_result
        )
    
    except Exception as e:
        return KnowledgeAnalysisResponse(
            success=False,
            error=f"Knowledge analysis failed: {str(e)}"
        )

@app.post("/api/learning-recommendations")
def get_learning_recommendations_endpoint(request: KnowledgeAnalysisRequest):
    """
    Get personalized learning recommendations based on knowledge gaps
    """
    try:
        recommendations = get_learning_recommendations(
            request.user_id,
            request.conversation_history
        )
        
        return {
            "success": True,
            "recommendations": recommendations
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to get learning recommendations: {str(e)}"
        }

# Content Recommendation Endpoints
@app.post("/api/content-recommendations", response_model=ContentRecommendationResponse)
def get_content_recommendations_endpoint(request: ContentRecommendationRequest):
    """
    Get health content recommendations for a specific topic
    """
    try:
        recommendations = get_health_content_recommendations(
            request.topic,
            request.category,
            request.content_type
        )
        
        return ContentRecommendationResponse(
            success=True,
            recommendations=recommendations
        )
    
    except Exception as e:
        return ContentRecommendationResponse(
            success=False,
            recommendations=[],
            error=f"Failed to get content recommendations: {str(e)}"
        )

@app.post("/api/personalized-content", response_model=ContentRecommendationResponse)
def get_personalized_content_endpoint(request: PersonalizedContentRequest):
    """
    Get personalized content recommendations based on knowledge gaps
    """
    try:
        recommendations = get_personalized_learning_content(
            request.knowledge_gaps,
            request.user_preferences
        )
        
        return ContentRecommendationResponse(
            success=True,
            recommendations=recommendations
        )
    
    except Exception as e:
        return ContentRecommendationResponse(
            success=False,
            recommendations=[],
            error=f"Failed to get personalized content: {str(e)}"
        )

@app.get("/api/trending-topics")
def get_trending_topics():
    """
    Get currently trending health topics
    """
    try:
        trending_topics = content_engine.get_trending_health_topics()
        
        return {
            "success": True,
            "trending_topics": trending_topics
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to get trending topics: {str(e)}"
        }