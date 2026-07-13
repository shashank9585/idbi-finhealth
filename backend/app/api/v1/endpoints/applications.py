from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.db.models import Application
from app.schemas.application import ApplicationCreate, ApplicationResponse

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(application: ApplicationCreate, db: Session = Depends(get_db)):
    """
    Creates a new MSME loan application and auto-detects the Tier.
    """
    # Check if PAN already exists
    existing = db.query(Application).filter(Application.pan == application.pan).first()
    if existing:
        raise HTTPException(status_code=400, detail="Application with this PAN already exists")

    # Auto-detect Tier based on GSTIN and the debug flag
    tier = "TIER_1"
    if application.simulate_zero_digital:
        tier = "TIER_3"
    elif not application.gstin:
        tier = "TIER_2"

    db_app = Application(
        business_name=application.business_name,
        pan=application.pan,
        gstin=application.gstin,
        applied_amount=application.applied_amount,
        loan_purpose=application.loan_purpose,
        tier=tier
    )
    
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/", response_model=List[ApplicationResponse])
def list_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Lists all MSME applications (Used for the Loan Queue Dashboard).
    """
    applications = db.query(Application).offset(skip).limit(limit).all()
    return applications

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: int, db: Session = Depends(get_db)):
    """
    Fetches a single application by ID.
    """
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app