import os
from sqlmodel import create_engine, Session

# Dynamically locate database directory relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "database")
os.makedirs(DB_DIR, exist_ok=True)

SQLITE_FILE = os.path.join(DB_DIR, "app.db")
sqlite_url = f"sqlite:///{SQLITE_FILE}"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session