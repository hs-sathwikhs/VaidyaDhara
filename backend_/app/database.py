# backend/app/database.py
import sqlite3
import os

# Define the database file path relative to this file's location
# This ensures it's always created inside the 'backend' folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_NAME = os.path.join(BASE_DIR, "vaidya_dhara.db")

def init_db():
    """Initializes the database and creates the query_logs table if it doesn't exist."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        # Create table for query logs
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS query_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            query_text TEXT NOT NULL,
            response_text TEXT,
            language TEXT,
            location_tag TEXT
        );
        """)
        conn.commit()
        conn.close()
        print("Database initialized successfully.")
    except sqlite3.Error as e:
        print(f"Database error: {e}")

def log_query(query_text: str, response_text: str, language: str = "en", location_tag: str = "Mysuru"):
    """Logs a single query and its response to the database."""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO query_logs (query_text, response_text, language, location_tag) VALUES (?, ?, ?, ?)",
            (query_text, response_text, language, location_tag)
        )
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"Failed to log query: {e}")