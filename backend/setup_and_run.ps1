# VaidyaDhara Backend Setup and Run Script

# Create virtual environment
python -m venv vaidya_env

# Activate virtual environment
.\vaidya_env\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# Create .env file for API keys (you'll need to add your Google API key)
@"
GOOGLE_API_KEY=your_google_api_key_here
"@ | Out-File -FilePath .env -Encoding utf8

Write-Host "Backend setup complete!"
Write-Host "Please add your Google API key to the .env file"
Write-Host "Then run: uvicorn app.main:app --reload --port 8000"
