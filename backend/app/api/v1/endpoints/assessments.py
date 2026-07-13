from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.db.models import HealthAssessment
from app.schemas.assessment import AssessmentResponse
from app.services.assessment_service import assessment_service

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.get("/", response_model=List[AssessmentResponse])
def list_all_assessments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Lists all generated health assessments (Portfolio View).
    """
    assessments = db.query(HealthAssessment).offset(skip).limit(limit).all()
    return assessments

@router.post("/{application_id}/generate", response_model=AssessmentResponse)
async def generate_assessment(application_id: int, db: Session = Depends(get_db)):
    """
    Triggers the Financial Health Assessment for a specific application.
    Runs the 3 Engines and generates the AI summary.
    """
    try:
        assessment = await assessment_service.generate_assessment(db, application_id)
        return assessment
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assessment generation failed: {str(e)}")

@router.get("/{application_id}", response_model=AssessmentResponse)
def get_assessment(application_id: int, db: Session = Depends(get_db)):
    """
    Fetches the latest Financial Health Card for an application.
    """
    assessment = db.query(HealthAssessment).filter(
        HealthAssessment.application_id == application_id
    ).order_by(HealthAssessment.generated_at.desc()).first()
    
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found. Please generate it first.")
    
    return assessment