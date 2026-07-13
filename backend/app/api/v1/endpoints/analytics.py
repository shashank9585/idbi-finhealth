from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import Application, HealthAssessment

router = APIRouter(prefix="/analytics", tags=["Analytics"])

class PortfolioOverview(BaseModel):
    total_applications: int
    total_loan_amount: float
    average_loan_amount: float
    average_health_score: float
    average_confidence: float
    pending_reviews: int
    approval_rate: float
    status_distribution: dict
    tier_distribution: dict

class RiskDistribution(BaseModel):
    low_risk: dict
    medium_risk: dict
    high_risk: dict

class TimeSeriesData(BaseModel):
    daily_applications: List[dict]
    period_days: int

class SectorData(BaseModel):
    sectors: dict

class AIvsHuman(BaseModel):
    ai_auto_assessed: int
    manual_assessment: int
    ai_percentage: float

class ApplicationDetail(BaseModel):
    id: int
    business_name: Optional[str]
    pan: str
    gstin: Optional[str]
    applied_amount: float
    tier: str
    status: str
    created_at: datetime
    health_score: Optional[int]
    confidence_score: Optional[float]
    risk_level: Optional[str]

@router.get("/portfolio-overview", response_model=PortfolioOverview)
def get_portfolio_overview(db: Session = Depends(get_db)):
    total_apps = db.query(func.count(Application.id)).scalar() or 0
    total_amount = db.query(func.sum(Application.applied_amount)).scalar() or 0
    avg_amount = db.query(func.avg(Application.applied_amount)).scalar() or 0
    
    health_scores = db.query(HealthAssessment.health_score).filter(
        HealthAssessment.health_score.isnot(None)
    ).all()
    avg_health = sum([s[0] for s in health_scores]) / len(health_scores) if health_scores else 0
    
    confidence_scores = db.query(HealthAssessment.confidence_score).filter(
        HealthAssessment.confidence_score.isnot(None)
    ).all()
    avg_confidence = sum([c[0] for c in confidence_scores]) / len(confidence_scores) if confidence_scores else 0
    
    pending_count = db.query(Application).filter(Application.status == "Processing").count()
    reviewed_count = db.query(Application).filter(
        Application.status.in_(["Reviewed", "Approved"])
    ).count()
    approval_rate = (reviewed_count / total_apps * 100) if total_apps > 0 else 0
    
    status_dist = db.query(
        Application.status,
        func.count(Application.id)
    ).group_by(Application.status).all()
    
    tier_dist = db.query(
        Application.tier,
        func.count(Application.id)
    ).group_by(Application.tier).all()
    
    return PortfolioOverview(
        total_applications=total_apps,
        total_loan_amount=total_amount,
        average_loan_amount=avg_amount,
        average_health_score=round(avg_health, 1),
        average_confidence=round(avg_confidence, 1),
        pending_reviews=pending_count,
        approval_rate=round(approval_rate, 1),
        status_distribution={status: count for status, count in status_dist},
        tier_distribution={tier: count for tier, count in tier_dist}
    )

@router.get("/risk-distribution", response_model=RiskDistribution)
def get_risk_distribution(db: Session = Depends(get_db)):
    assessments = db.query(HealthAssessment).filter(
        HealthAssessment.health_score.isnot(None)
    ).all()
    
    low_risk = 0
    medium_risk = 0
    high_risk = 0
    
    for assessment in assessments:
        if assessment.health_score >= 700:
            low_risk += 1
        elif assessment.health_score >= 400:
            medium_risk += 1
        else:
            high_risk += 1
    
    total = low_risk + medium_risk + high_risk
    
    return RiskDistribution(
        low_risk={
            "count": low_risk,
            "percentage": round(low_risk / total * 100, 1) if total > 0 else 0
        },
        medium_risk={
            "count": medium_risk,
            "percentage": round(medium_risk / total * 100, 1) if total > 0 else 0
        },
        high_risk={
            "count": high_risk,
            "percentage": round(high_risk / total * 100, 1) if total > 0 else 0
        }
    )

@router.get("/time-series", response_model=TimeSeriesData)
def get_time_series_analytics(
    days: int = Query(default=30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    daily_apps = db.query(
        func.date(Application.created_at).label("date"),
        func.count(Application.id).label("count")
    ).filter(
        Application.created_at >= cutoff_date
    ).group_by(
        func.date(Application.created_at)
    ).order_by("date").all()
    
    return TimeSeriesData(
        daily_applications=[
            {"date": str(date), "count": count} 
            for date, count in daily_apps
        ],
        period_days=days
    )

@router.get("/sector-distribution", response_model=SectorData)
def get_sector_distribution(db: Session = Depends(get_db)):
    apps = db.query(Application).all()
    
    sectors = {}
    for app in apps:
        name = (app.business_name or "").lower()
        if any(word in name for word in ["textile", "fabric", "cloth"]):
            sector = "Textile"
        elif any(word in name for word in ["tech", "software", "digital"]):
            sector = "Technology"
        elif any(word in name for word in ["food", "restaurant", "cafe"]):
            sector = "Food & Beverage"
        elif any(word in name for word in ["retail", "shop", "store"]):
            sector = "Retail"
        else:
            sector = "Manufacturing"
        
        if sector not in sectors:
            sectors[sector] = {"count": 0, "amount": 0}
        sectors[sector]["count"] += 1
        sectors[sector]["amount"] += app.applied_amount
    
    return SectorData(sectors=sectors)

@router.get("/ai-vs-human", response_model=AIvsHuman)
def get_ai_vs_human_breakdown(db: Session = Depends(get_db)):
    tier1_count = db.query(Application).filter(Application.tier == "TIER_1").count()
    tier2_count = db.query(Application).filter(Application.tier == "TIER_2").count()
    tier3_count = db.query(Application).filter(Application.tier == "TIER_3").count()
    
    total = tier1_count + tier2_count + tier3_count
    
    return AIvsHuman(
        ai_auto_assessed=tier1_count + tier2_count,
        manual_assessment=tier3_count,
        ai_percentage=round((tier1_count + tier2_count) / total * 100, 1) if total > 0 else 0
    )

@router.get("/applications-detailed", response_model=List[ApplicationDetail])
def get_detailed_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    tier: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_score: Optional[int] = Query(None),
    max_score: Optional[int] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Application).outerjoin(
        HealthAssessment, Application.id == HealthAssessment.application_id
    )
    
    if tier:
        query = query.filter(Application.tier == tier)
    if status:
        query = query.filter(Application.status == status)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Application.business_name.ilike(search_term),
                Application.pan.ilike(search_term),
                Application.gstin.ilike(search_term)
            )
        )
    if date_from:
        query = query.filter(Application.created_at >= datetime.fromisoformat(date_from))
    if date_to:
        query = query.filter(Application.created_at <= datetime.fromisoformat(date_to))
    
    apps = query.offset(skip).limit(limit).all()
    
    result = []
    for app in apps:
        assessment = db.query(HealthAssessment).filter(
            HealthAssessment.application_id == app.id
        ).order_by(HealthAssessment.generated_at.desc()).first()
        
        health_score = assessment.health_score if assessment else None
        confidence_score = assessment.confidence_score if assessment else None
        
        risk_level = None
        if health_score is not None:
            if health_score >= 700:
                risk_level = "Low"
            elif health_score >= 400:
                risk_level = "Medium"
            else:
                risk_level = "High"
        
        if min_score and (health_score is None or health_score < min_score):
            continue
        if max_score and (health_score is None or health_score > max_score):
            continue
        
        result.append(ApplicationDetail(
            id=app.id,
            business_name=app.business_name,
            pan=app.pan,
            gstin=app.gstin,
            applied_amount=app.applied_amount,
            tier=app.tier,
            status=app.status,
            created_at=app.created_at,
            health_score=health_score,
            confidence_score=confidence_score,
            risk_level=risk_level
        ))
    
    return result