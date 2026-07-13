from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
from datetime import datetime
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import Application

router = APIRouter(prefix="/documents", tags=["Documents"])

# Upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    file_type: str
    file_size: int
    upload_timestamp: datetime
    status: str
    extracted_text: Optional[str] = None
    ai_analysis: Optional[dict] = None

@router.post("/upload/{application_id}", response_model=DocumentUploadResponse)
async def upload_document(
    application_id: int,
    file: UploadFile = File(...),
    document_type: str = Form(...),  # "bank_statement", "gst_return", "utility_bill", etc.
    db: Session = Depends(get_db)
):
    """
    Upload document for an application with simulated OCR and AI analysis
    """
    # Verify application exists
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    file_size = len(content)
    
    # Simulate OCR text extraction (In production, use Tesseract.js or cloud API)
    extracted_text = simulate_ocr_extraction(document_type, file.filename)
    
    # Simulate AI analysis of the document
    ai_analysis = simulate_ai_document_analysis(document_type, extracted_text)
    
    return DocumentUploadResponse(
        document_id=unique_filename,
        filename=file.filename,
        file_type=document_type,
        file_size=file_size,
        upload_timestamp=datetime.utcnow(),
        status="processed",
        extracted_text=extracted_text,
        ai_analysis=ai_analysis
    )

def simulate_ocr_extraction(document_type: str, filename: str) -> str:
    """
    Simulates OCR text extraction from uploaded document
    In production, this would use Tesseract.js or AWS Textract
    """
    if document_type == "bank_statement":
        return """
        ACCOUNT STATEMENT
        Account Number: XXXX-XXXX-1234
        Period: 01-Jan-2024 to 31-Dec-2024
        
        Date        Description                    Debit        Credit       Balance
        01-Jan      Opening Balance                                            125,430.00
        05-Jan      UPI Credit - Customer A                     45,000.00    170,430.00
        10-Jan      Cash Deposit                                35,000.00    205,430.00
        15-Jan      Supplier Payment - XYZ Ltd    28,500.00                 176,930.00
        20-Jan      UPI Credit - Customer B                     52,000.00    228,930.00
        25-Jan      Utility Payment                4,500.00                  224,430.00
        
        Average Monthly Balance: 195,430.00
        Total Credits: 468,000.00
        Total Debits: 33,000.00
        """
    elif document_type == "gst_return":
        return """
        GST RETURN - GSTR-3B
        GSTIN: 27AABCS1234A1Z5
        Period: January 2024
        
        Outward Supplies (Sales):
        - Taxable Sales: 4,50,000.00
        - Tax Amount (CGST): 40,500.00
        - Tax Amount (SGST): 40,500.00
        
        Inward Supplies (Purchases):
        - Taxable Purchases: 2,80,000.00
        - Input Tax Credit: 25,200.00
        
        Net Tax Payable: 55,800.00
        Status: FILED ON TIME
        """
    elif document_type == "utility_bill":
        return """
        ELECTRICITY BILL
        Consumer Name: Sharma Textiles Pvt Ltd
        Consumer Number: 1234567890
        Billing Period: 01-Jan-2024 to 31-Jan-2024
        
        Units Consumed: 1,250 kWh
        Amount Payable: 4,500.00
        Due Date: 15-Feb-2024
        Status: PAID ON 10-Feb-2024
        
        Billing Address:
        Plot No. 45, MIDC Industrial Area
        Andheri East, Mumbai - 400093
        """
    else:
        return "Document text extraction completed. No structured data found."

def simulate_ai_document_analysis(document_type: str, extracted_text: str) -> dict:
    """
    Simulates AI analysis of extracted document text
    In production, this would use NLP to validate and extract key fields
    """
    if document_type == "bank_statement":
        return {
            "validation_status": "verified",
            "extracted_fields": {
                "average_monthly_balance": 195430,
                "total_credits": 468000,
                "total_debits": 33000,
                "account_active": True,
                "overdraft_instances": 0
            },
            "consistency_check": {
                "matches_declared_revenue": True,
                "variance_percentage": 2.3,
                "red_flags": []
            },
            "confidence_score": 94.5
        }
    elif document_type == "gst_return":
        return {
            "validation_status": "verified",
            "extracted_fields": {
                "gstin": "27AABCS1234A1Z5",
                "total_sales": 450000,
                "total_purchases": 280000,
                "filing_status": "on_time",
                "tax_compliance": "compliant"
            },
            "consistency_check": {
                "gstin_matches_application": True,
                "revenue_matches_bank": True,
                "variance_percentage": 1.8
            },
            "confidence_score": 96.2
        }
    elif document_type == "utility_bill":
        return {
            "validation_status": "verified",
            "extracted_fields": {
                "bill_amount": 4500,
                "payment_status": "paid",
                "payment_date": "2024-02-10",
                "address_verified": True,
                "business_premises_confirmed": True
            },
            "consistency_check": {
                "address_matches_application": True,
                "regular_payments": True,
                "months_paid_on_time": 12
            },
            "confidence_score": 91.8
        }
    else:
        return {
            "validation_status": "pending_review",
            "confidence_score": 65.0
        }

@router.get("/{application_id}")
def get_application_documents(application_id: int, db: Session = Depends(get_db)):
    """
    Get all documents uploaded for an application
    """
    # In production, query from database
    # For demo, return mock data
    return {
        "documents": [
            {
                "document_id": "doc_001",
                "filename": "bank_statement_jan_2024.pdf",
                "document_type": "bank_statement",
                "upload_date": "2024-01-15T10:30:00Z",
                "status": "verified",
                "ai_confidence": 94.5
            },
            {
                "document_id": "doc_002",
                "filename": "gst_return_jan_2024.pdf",
                "document_type": "gst_return",
                "upload_date": "2024-01-16T14:20:00Z",
                "status": "verified",
                "ai_confidence": 96.2
            }
        ]
    }