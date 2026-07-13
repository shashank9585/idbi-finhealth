from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text
from sqlalchemy.sql import func
from app.db.base import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String, index=True, nullable=True)
    pan = Column(String, unique=True, index=True, nullable=False) # MANDATORY
    gstin = Column(String, nullable=True) # OPTIONAL
    applied_amount = Column(Float, nullable=False)
    loan_purpose = Column(String, nullable=True)
    
    # NEW: Tier tracking
    tier = Column(String, default="TIER_1") # TIER_1, TIER_2, TIER_3
    data_profile = Column(String, default="FULL_DIGITAL") 
    
    status = Column(String, default="Processing")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class HealthAssessment(Base):
    __tablename__ = "health_assessments"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, index=True, nullable=False)
    
    health_score = Column(Integer, nullable=True) # Null for Tier 3
    confidence_score = Column(Float, nullable=True)
    trust_status = Column(String, nullable=True)
    
    dimension_scores = Column(JSON, nullable=True)
    ai_executive_summary = Column(Text, nullable=True)
    market_context = Column(JSON, nullable=True)
    
    strengths = Column(JSON, nullable=True)
    risks = Column(JSON, nullable=True)
    cross_verification_matrix = Column(JSON, nullable=True)
    data_coverage = Column(JSON, nullable=True)
    industry_benchmark = Column(Integer, nullable=True)
    health_timeline = Column(JSON, nullable=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    data_freshness = Column(JSON, nullable=True)
    
    # NEW: Tier 3 Physical Assessment Data
    physical_assessment = Column(JSON, nullable=True) 

class OfficerDecision(Base):
    __tablename__ = "officer_decisions"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, index=True, nullable=False)
    assessment_id = Column(Integer, index=True, nullable=False)
    officer_name = Column(String, nullable=False)
    recommendation = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    conditions = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())