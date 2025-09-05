# Run the VaidyaDhara Backend Server
# Make sure you have set up the environment and added your Google API key to .env

# Activate virtual environment
.\vaidya_env\Scripts\Activate.ps1

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
