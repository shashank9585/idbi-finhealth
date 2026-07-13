import random
import hashlib
from typing import Dict, Any

class DataGenerator:
    """
    Generates deterministic financial profiles based on PAN and Loan Amount.
    Handles Tier 1 (Full), Tier 2 (Semi), and Tier 3 (Zero Digital).
    """
    
    @staticmethod
    def _get_seed(pan: str, amount: float) -> int:
        """Creates a deterministic seed from PAN and Amount so the demo is consistent."""
        seed_str = f"{pan}_{amount}"
        return int(hashlib.sha256(seed_str.encode()).hexdigest(), 16) % (2**32)

    @staticmethod
    def generate_financial_profile(pan: str, applied_amount: float, tier: str) -> Dict[str, Any]:
        seed = DataGenerator._get_seed(pan, applied_amount)
        rng = random.Random(seed) # Use seeded random for consistency
        
        if tier == "TIER_3":
            # Zero Digital: No financial data generated
            return {
                "is_zero_digital": True,
                "monthly_inflows": [],
                "avg_monthly_inflow": 0,
                "transaction_count_12m": 0
            }

        # Base monthly revenue is roughly 20-30% of the requested loan amount
        base_monthly_revenue = applied_amount * 0.25 
        monthly_inflows = []
        current_revenue = base_monthly_revenue
        
        for i in range(12):
            growth = rng.uniform(0.02, 0.05)
            volatility = rng.uniform(-0.05, 0.05)
            current_revenue = current_revenue * (1 + growth + volatility)
            monthly_inflows.append(int(current_revenue))

        avg_inflow = sum(monthly_inflows) / 12
        transaction_count = int(avg_inflow / 10000) * 12 
        
        # Tier 2 has higher cash concentration and lower digital footprint
        cash_deposit_concentration = rng.uniform(0.4, 0.7) if tier == "TIER_2" else rng.uniform(0.1, 0.3)
        gst_filing_rate = 0.0 if tier == "TIER_2" else rng.choice([1.0, 1.0, 0.92])

        return {
            "is_zero_digital": False,
            "monthly_inflows": monthly_inflows,
            "avg_monthly_inflow": avg_inflow,
            "cash_flow_trend": "improving" if monthly_inflows[-1] > monthly_inflows[0] else "declining",
            "transaction_count_12m": transaction_count,
            "dormant_months": 0,
            "unique_counterparties": rng.randint(20, 80),
            "revenue_volatility": rng.uniform(0.05, 0.20),
            "business_age_months": rng.randint(24, 60),
            "gst_filing_rate": gst_filing_rate,
            "epfo_compliant": rng.random() > 0.2,
            "compliance_penalties": 0 if gst_filing_rate == 1.0 else rng.randint(1, 3),
            "bounced_payments_12m": rng.randint(0, 4),
            "utility_payment_rate": rng.uniform(0.8, 1.0),
            "overdraft_usage_frequency": rng.choice(["none", "low", "high"]),
            "yoy_revenue_growth": rng.uniform(5.0, 25.0),
            "customer_base_growth": rng.uniform(0.0, 15.0),
            "top_customer_revenue_share": rng.uniform(15.0, 45.0),
            "unique_suppliers": rng.randint(10, 30),
            "avg_customer_relationship_months": rng.randint(12, 36),
            "round_trip_funding_detected": rng.random() > 0.8,
            "cash_deposit_concentration": cash_deposit_concentration
        }

    @staticmethod
    def generate_data_metadata(profile: Dict[str, Any], tier: str) -> Dict[str, Any]:
        available_sources = []
        missing_sources = []

        if tier == "TIER_1":
            available_sources = [
                {"source": "GST Returns", "freshness": "Yesterday"},
                {"source": "Bank Statements (AA)", "freshness": "Today"},
                {"source": "UPI Transactions", "freshness": "Today"},
                {"source": "EPFO Payroll", "freshness": "2 days ago"}
            ]
            missing_sources = [{"source": "Utility Bills"}]
        elif tier == "TIER_2":
            available_sources = [
                {"source": "Bank Statements (AA)", "freshness": "Today"},
                {"source": "UPI Transactions", "freshness": "Today"}
            ]
            missing_sources = [
                {"source": "GST Returns"},
                {"source": "EPFO Payroll"},
                {"source": "Utility Bills"}
            ]

        # Mock Cross-Verification
        annual_revenue = sum(profile.get("monthly_inflows", [0]))
        bank_credits = annual_revenue * 0.95
        
        cross_verification = {
            "revenue_match": {
                "metric": "Annual Revenue",
                "gst_reported": int(annual_revenue) if tier == "TIER_1" else 0,
                "bank_credits": int(bank_credits),
                "delta_percent": 5.0 if tier == "TIER_1" else 0.0,
                "status": "GREEN" if tier == "TIER_1" else "N/A"
            }
        }

        return {
            "available_sources": available_sources,
            "missing_sources": missing_sources,
            "cross_verification_matrix": cross_verification
        }