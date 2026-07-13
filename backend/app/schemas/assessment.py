from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class AssessmentResponse(BaseModel):
    id: int
    application_id: int
    
    # The 3 Engines
    health_score: int
    confidence_score: float
    trust_status: str
    
    # The 7 Dimensions
    dimension_scores: Dict[str, int]
    
    # AI & Evidence
    ai_executive_summary: Optional[str]
    strengths: Optional[List[str]]
    risks: Optional[List[str]]
    cross_verification_matrix: Optional[Dict[str, Any]]
    data_coverage: Optional[Dict[str, Any]]
    
    # Metadata
    industry_benchmark: Optional[int]
    health_timeline: Optional[List[Dict[str, Any]]]
    generated_at: datetime

    class Config:
        from_attributes = True