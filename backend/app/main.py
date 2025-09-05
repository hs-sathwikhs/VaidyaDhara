# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Import our custom modules
from . import ai_engine, database

# --- Pydantic Models ---
# These models define the structure of the data for our API requests and responses.
# FastAPI uses them for validation and documentation.
class ChatRequest(BaseModel):
    question: str
    language: str = "en"
    location: str = "Mysuru"

class ChatResponse(BaseModel):
    answer: str

# --- Application Lifespan ---
# This function runs code when the application starts up or shuts down.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup, initialize the database and the AI engine.
    # This is efficient because the AI model is loaded only once.
    print("Application startup...")
    database.init_db()
    ai_engine.initialize_ai_engine()
    yield
    # On shutdown, you could add cleanup code here if needed.
    print("Application shutdown.")

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Vaidya Dhara API",
    description="API for the AI-powered public health chatbot.",
    version="1.0.0",
    lifespan=lifespan
)

# --- CORS (Cross-Origin Resource Sharing) Middleware ---
# This is a security feature that allows our React frontend (running on a different port)
# to make requests to this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # The default URL for the Vite React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/")
def read_root():
    """A simple health check endpoint to confirm the API is running."""
    return {"status": "Vaidya Dhara Backend is running!"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_bot(request: ChatRequest):
    """
    The main endpoint for the chatbot.
    Receives a question and returns an AI-generated answer.
    """
    # 1. Get a response from the AI engine
    response_text = ai_engine.get_ai_response(request.question)
    
    # 2. Log the entire interaction to our database
    database.log_query(
        query_text=request.question,
        response_text=response_text,
        language=request.language,
        location_tag=request.location
    )
    
    # 3. Return the response to the user
    return ChatResponse(answer=response_text)