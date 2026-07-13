import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import engine
from app.db.base import Base
from app.api.v1.router import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create database tables automatically on startup
logger.info("️ Creating database tables...")
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Financial Health Assessment Platform for MSMEs",
)

# Add CORS middleware (Crucial for Next.js to talk to FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Welcome to the IDBI MSME Financial Health Card API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 IDBI Financial Health API is starting up...")
    logger.info(f"📖 Swagger UI available at: http://localhost:8000/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)