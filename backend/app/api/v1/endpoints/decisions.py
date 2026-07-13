from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import Application, HealthAssessment

router = APIRouter(prefix="/decisions", tags=["Decisions"])

class DecisionPayload(BaseModel):
    recommendation: str
    notes: str
    final_confidence: float

@router.post("/{application_id}")
def submit_decision(application_id: int, payload: DecisionPayload, db: Session = Depends(get_db)):
    """
    Saves the officer's decision and updates the application status.
    """
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Update status based on recommendation
    if payload.recommendation == "proceed":
        app.status = "Approved"
    elif payload.recommendation == "reject":
        app.status = "Rejected"
    else:
        app.status = "Pending Info"

    db.commit()
    db.refresh(app)

    return {"message": "Decision submitted successfully", "new_status": app.status}