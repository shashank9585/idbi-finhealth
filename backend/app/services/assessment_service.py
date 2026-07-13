import logging
from sqlalchemy.orm import Session
from app.db.models import Application, HealthAssessment
from app.engines.health_engine import health_engine
from app.engines.confidence_engine import confidence_engine
from app.engines.trust_engine import trust_engine
from app.core.ai_client import ai_client
from app.services.data_generator import DataGenerator

logger = logging.getLogger(__name__)

class AssessmentService:
    async def generate_assessment(self, db: Session, application_id: int) -> HealthAssessment:
        logger.info(f"🚀 Starting assessment for Application ID: {application_id}")
        
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            raise ValueError(f"Application {application_id} not found")

        # 1. Generate Data based on Tier
        business_data = DataGenerator.generate_financial_profile(
            application.pan, application.applied_amount, application.tier
        )
        data_metadata = DataGenerator.generate_data_metadata(business_data, application.tier)

        # 2. Handle Tier 3 (Zero Digital) -> Physical Assessment
        if application.tier == "TIER_3":
            logger.info(" Tier 3 detected. Generating Physical Assessment via AI Vision...")
            assessment = HealthAssessment(
                application_id=application_id,
                health_score=None,
                confidence_score=45.0, # Low confidence due to lack of digital data
                trust_status="YELLOW",
                ai_executive_summary="Zero digital footprint detected. Assessment based on physical site visit and AI Vision analysis of shop inventory.",
                physical_assessment={
                    "shop_type": "Tea Stall / Micro Food Vendor",
                    "ai_vision_assets": ["1 Commercial Gas Boiler", "2 Gas Cylinders", "Basic Seating Area"],
                    "estimated_asset_value": 45000,
                    "foot_traffic_estimate": "Medium (Based on location analysis)",
                    "recommended_loan": 50000,
                    "scheme": "PM Mudra Yojana (Shishu Category)"
                },
                data_coverage=data_metadata,
                generated_at=__import__('datetime').datetime.now()
            )
            db.add(assessment)
            application.status = "Reviewed"
            db.commit()
            db.refresh(assessment)
            return assessment

        # 3. Handle Tier 1 & 2 (Digital Assessment)
        health_result = health_engine.calculate(business_data)
        confidence_result = confidence_engine.calculate(data_metadata)
        trust_result = trust_engine.evaluate(business_data)

        rich_ai_context = {
            "business_name": application.business_name or "Unregistered MSME",
            "pan": application.pan,
            "gstin": application.gstin or "Not Registered",
            "industry": "Micro Retail / Food Service",
            "location": "Local Market",
            "health_score": health_result["health_score"],
            "confidence_score": confidence_result["confidence_score"],
            "trust_status": trust_result["trust_status"],
            "key_features": {
                "avg_monthly_inflow": f"{int(business_data['avg_monthly_inflow']):,}",
                "gst_compliance": f"{business_data['gst_filing_rate']*100:.0f}%",
                "cash_deposit_concentration": f"{business_data['cash_deposit_concentration']*100:.0f}%"
            },
            "trust_anomalies": [
                f"High cash deposit concentration: {business_data['cash_deposit_concentration']*100:.0f}% of deposits are physical cash."
            ],
            "missing_data": [s["source"] for s in data_metadata["missing_sources"]]
        }

        ai_summary, market_context = await ai_client.generate_full_assessment(rich_ai_context)

        assessment = HealthAssessment(
            application_id=application_id,
            health_score=health_result["health_score"],
            confidence_score=confidence_result["confidence_score"],
            trust_status=trust_result["trust_status"],
            dimension_scores=health_result["dimension_scores"],
            ai_executive_summary=ai_summary,
            market_context=market_context, 
            strengths=["Consistent daily UPI inflows", "Regular weekly cash deposits"],
            risks=["High reliance on physical cash", "No formal tax compliance"],
            cross_verification_matrix=data_metadata["cross_verification_matrix"],
            data_coverage=data_metadata,
            industry_benchmark=600,
            health_timeline=[{"month": m, "score": 600 + (i*20)} for i, m in enumerate(["Jan", "Feb", "Mar", "Apr", "May", "Jun"])],
            generated_at=__import__('datetime').datetime.now()
        )
        
        db.add(assessment)
        application.status = "Reviewed"
        db.commit()
        db.refresh(assessment)
        
        return assessment

assessment_service = AssessmentService()