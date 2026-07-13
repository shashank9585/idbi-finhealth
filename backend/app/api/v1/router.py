from fastapi import APIRouter
from app.api.v1.endpoints import applications, assessments, decisions, analytics, documents

api_router = APIRouter()

api_router.include_router(applications.router)
api_router.include_router(assessments.router)
api_router.include_router(decisions.router)
api_router.include_router(analytics.router)
api_router.include_router(documents.router)