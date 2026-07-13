"""
Elite Mock Data for Financial Health Assessment.
This data is used as a fallback when the AI API times out or fails.
It represents realistic, professional-grade analysis for a textile MSME.
"""

# AI Executive Summary
MOCK_AI_SUMMARY = """
Sharma Textiles demonstrates strong operational cash flow and consistent GST compliance over the last 18 months, scoring 785/1000 which is well above the textile industry benchmark of 710. The business shows steady growth momentum with a 6-month upward trend. However, confidence is moderate at 72% due to missing utility payment history and a 15% discrepancy between reported GST sales and actual bank credits. Recommendation: Proceed to underwriting, but conditionally request 6 months of electricity bills to verify operational overheads and clarify the GST mismatch before final approval.
"""

# Business Strengths
MOCK_STRENGTHS = [
    "Consistent monthly cash inflows averaging ₹4.25L over the last 12 months with positive operating cash flow in all periods",
    "Excellent compliance record: GST returns filed on time for 24 consecutive months with zero penalties",
    "Zero bounced payments or overdue EMIs in the last 24 months, demonstrating strong financial discipline",
    "Diversified customer base with top 5 customers contributing 65% of revenue, reducing concentration risk",
    "Steady growth trajectory: Revenue increased 18% year-over-year with consistent month-over-month momentum"
]

# Business Risks
MOCK_RISKS = [
    "High customer concentration detected: Single customer 'ABC Textiles Ltd' accounts for 35% of total revenue (₹12L of ₹34L monthly average)",
    "GST vs Bank credit mismatch: GST reports ₹50L annual revenue but bank credits show only ₹42.5L, indicating potential cash sales or unrecorded transactions",
    "Missing utility payment history: No electricity or water bill payment data available, preventing full assessment of operational overheads",
    "Seasonal volatility: Q2 (July-September) shows 22% lower activity compared to Q1, requiring verification of seasonal business patterns"
]

# Cross-Verification Matrix
MOCK_CROSS_VERIFICATION = {
    "revenue_match": {
        "metric": "Annual Revenue",
        "gst_reported": 5000000,
        "bank_credits": 4850000,
        "upi_inflows": 4500000,
        "delta_percent": 3.0,
        "status": "GREEN",
        "explanation": "Revenue figures are consistent across GST and bank statements with acceptable 3% variance"
    },
    "top_customer_match": {
        "metric": "Top Customer (ABC Textiles)",
        "gst_reported": 1200000,
        "bank_credits": 400000,
        "upi_inflows": 0,
        "delta_percent": 66.6,
        "status": "RED",
        "explanation": "Major mismatch: GST shows ₹12L from top customer but bank only shows ₹4L. Remaining ₹8L may be cash or unrecorded"
    },
    "supplier_payments": {
        "metric": "Supplier Payments",
        "gst_reported": 2800000,
        "bank_debits": 2750000,
        "delta_percent": 1.8,
        "status": "GREEN",
        "explanation": "Supplier payments are well-documented and consistent across sources"
    }
}

# Data Coverage
MOCK_DATA_COVERAGE = {
    "available": [
        {"source": "GST Returns", "status": "verified", "freshness": "Yesterday", "records": 24},
        {"source": "Bank Statements (AA)", "status": "verified", "freshness": "Today", "records": 365},
        {"source": "UPI Transactions", "status": "verified", "freshness": "Today", "records": 18254},
        {"source": "EPFO Payroll", "status": "verified", "freshness": "2 days ago", "records": 12}
    ],
    "missing": [
        {"source": "Utility Bills (Electricity)", "status": "not_requested", "impact": "high"},
        {"source": "Trade References", "status": "not_requested", "impact": "medium"},
        {"source": "Income Tax Returns", "status": "not_requested", "impact": "low"}
    ]
}

# Health Timeline (6 months)
MOCK_HEALTH_TIMELINE = [
    {"month": "January", "score": 690},
    {"month": "February", "score": 710},
    {"month": "March", "score": 735},
    {"month": "April", "score": 748},
    {"month": "May", "score": 760},
    {"month": "June", "score": 785}
]

# Dimension Scores (7 dimensions)
MOCK_DIMENSION_SCORES = {
    "cash_flow": 850,
    "business_activity": 820,
    "business_stability": 780,
    "compliance": 920,
    "financial_discipline": 880,
    "growth": 740,
    "business_network": 690
}

# Industry Benchmark
MOCK_INDUSTRY_BENCHMARK = 710

# Sample Application Data
MOCK_APPLICATION = {
    "business_name": "Sharma Textiles Pvt Ltd",
    "gstin": "27AABCS1234A1Z5",
    "pan": "AABCS1234A",
    "applied_amount": 1500000,
    "loan_purpose": "Working Capital Expansion",
    "industry": "Textile Manufacturing",
    "udyam_id": "UDYAM-MH-00-1234567"
}


# ... [Keep all existing MOCK_AI_SUMMARY, MOCK_STRENGTHS, MOCK_RISKS, etc. exactly as they were] ...

# ADD THIS NEW MOCK DATA AT THE BOTTOM:
MOCK_MARKET_CONTEXT = {
    "overall_outlook": "Neutral to Positive",
    "industry_trends": [
        "Domestic textile demand in Maharashtra is projected to grow by 8% YoY, driven by festive season consumption.",
        "Shift towards sustainable fabrics: 30% of local buyers are now demanding organic cotton blends."
    ],
    "supply_chain_risks": [
        "Raw cotton prices have seen a 12% volatility index over the last 6 months due to import duties.",
        "Heavy reliance on Surat-based dyeing units creates a geographic concentration risk."
    ],
    "competitive_landscape": "Market saturation in the mid-tier segment is high. 14 new MSME textile units registered in the district in the last 12 months. Differentiation through B2B contracts is critical.",
    "regulatory_headwinds": [
        "Upcoming GST compliance changes for MSMEs with turnover > ₹5Cr may increase accounting overheads.",
        "New environmental norms for textile dyeing units require capital expenditure on effluent treatment by Q3."
    ]
}