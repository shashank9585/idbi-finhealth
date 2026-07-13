from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# SQLite requires this specific argument to work properly with FastAPI
connect_args = {"check_same_thread": False}

# Create the database engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session in API endpoints
def get_db():
    """
    FastAPI dependency that provides a database session.
    Automatically closes the session when the request is done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()