from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "IDBI Financial Health Card"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database (SQLite - Zero Setup)
    # This creates a local file named finhealth.db in the backend folder
    DATABASE_URL: str = "sqlite:///./finhealth.db"
    
    # Redis (Optional, keeping default localhost)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # AI API (Your apifreellm.com)
    AI_API_URL: str = "https://apifreellm.com/api/v1/chat"
    AI_API_KEY: str = "apf_qwy2n598j33z8p14ri8omuph"
    AI_TIMEOUT_SECONDS: int = 5  # We timeout after 5s and use mock fallback
    
    # India Stack (Mock endpoints for hackathon)
    AA_API_URL: str = "http://localhost:8000/mock/aa"
    ULI_API_URL: str = "http://localhost:8000/mock/uli"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create a global settings instance
settings = Settings()