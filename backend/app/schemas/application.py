from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    business_name: Optional[str] = None
    pan: str = Field(..., example="AABCS1234A")
    gstin: Optional[str] = Field(None, example="27AABCS1234A1Z5")
    applied_amount: float = Field(..., example=150000.0)
    loan_purpose: Optional[str] = Field(None, example="Working Capital Expansion")

class ApplicationCreate(ApplicationBase):
    # Added for the frontend demo to simulate a zero-digital footprint
    simulate_zero_digital: bool = False

class ApplicationResponse(ApplicationBase):
    id: int
    tier: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True