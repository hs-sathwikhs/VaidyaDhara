# backend/app/database.py
import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

# Get the project root directory (2 levels up from this file)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Database path in the root database folder
DATABASE_NAME = os.path.join(PROJECT_ROOT, 'database', 'vaidya_dhara.db')

# Ensure database directory exists
os.makedirs(os.path.join(PROJECT_ROOT, 'database'), exist_ok=True)

def init_db():
    """Initializes the database and creates tables if they don't exist."""
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
        # --- NEW: Create table for users and their points ---
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            points INTEGER DEFAULT 0
        );
        """)
        conn.commit()
        conn.close()
        print("Database initialized successfully.")
    except sqlite3.Error as e:
        print(f"Database error: {e}")

def log_query(query_text: str, response_text: str, language: str = "en", location_tag: str = "Mysuru"):
    # (This function remains unchanged)
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

# --- NEW: Functions for gamification ---
def get_or_create_user(user_id: str):
    """Gets a user's data or creates them if they don't exist."""
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    if user is None:
        cursor.execute("INSERT INTO users (id, points) VALUES (?, ?)", (user_id, 0))
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
    conn.close()
    return {"id": user[0], "points": user[1]}

def add_points_to_user(user_id: str, points_to_add: int):
    """Adds points to a user's score and returns the new total."""
    user = get_or_create_user(user_id)
    new_points = user['points'] + points_to_add
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET points = ? WHERE id = ?", (new_points, user_id))
    conn.commit()
    conn.close()
    return new_points