"""
Business Rules for Financial Health Assessment.
Each function evaluates a specific dimension and returns a score (0-1000).
"""

from typing import Dict, Any, List

class FinancialHealthRules:
    """
    Encapsulates all business rules for calculating the 7 dimensions
    of the Financial Health Score.
    """
    
    @staticmethod
    def calculate_cash_flow_health(data: Dict[str, Any]) -> int:
        """
        Evaluates cash flow stability and sustainability.
        Weight: 25%
        """
        score = 500  # Base score
        
        # Check monthly inflows consistency
        monthly_inflows = data.get("monthly_inflows", [])
        if len(monthly_inflows) >= 12:
            avg_inflow = sum(monthly_inflows) / len(monthly_inflows)
            if avg_inflow > 300000:  # ₹3L+ monthly
                score += 200
            elif avg_inflow > 150000:  # ₹1.5L+ monthly
                score += 100
            
            # Check for negative months
            negative_months = sum(1 for x in monthly_inflows if x < 0)
            if negative_months == 0:
                score += 150
            elif negative_months <= 2:
                score += 50
        
        # Check cash flow trend
        trend = data.get("cash_flow_trend", "stable")
        if trend == "improving":
            score += 100
        elif trend == "declining":
            score -= 100
        
        return min(1000, max(0, score))
    
    @staticmethod
    def calculate_business_activity(data: Dict[str, Any]) -> int:
        """
        Evaluates whether the business is genuinely operating.
        Weight: 15%
        """
        score = 500
        
        # Check transaction frequency
        transaction_count = data.get("transaction_count_12m", 0)
        if transaction_count > 300:
            score += 250
        elif transaction_count > 150:
            score += 150
        elif transaction_count > 50:
            score += 50
        
        # Check for dormant periods
        dormant_months = data.get("dormant_months", 0)
        if dormant_months == 0:
            score += 200
        elif dormant_months <= 2:
            score += 100
        
        # Check transaction diversity
        unique_parties = data.get("unique_counterparties", 0)
        if unique_parties > 50:
            score += 150
        elif unique_parties > 20:
            score += 75
        
        return min(1000, max(0, score))
    
    @staticmethod
    def calculate_business_stability(data: Dict[str, Any]) -> int:
        """
        Evaluates consistency and predictability over time.
        Weight: 15%
        """
        score = 500
        
        # Check revenue volatility
        volatility = data.get("revenue_volatility", 0.5)  # 0-1 scale
        if volatility < 0.1:  # Very stable
            score += 300
        elif volatility < 0.2:  # Stable
            score += 200
        elif volatility < 0.3:  # Moderate
            score += 100
        else:  # High volatility
            score -= 100
        
        # Check business age
        business_age_months = data.get("business_age_months", 0)
        if business_age_months > 36:  # 3+ years
            score += 150
        elif business_age_months > 24:  # 2+ years
            score += 100
        elif business_age_months > 12:  # 1+ year
            score += 50
        
        return min(1000, max(0, score))
    
    @staticmethod
    def calculate_compliance(data: Dict[str, Any]) -> int:
        """
        Evaluates adherence to statutory obligations.
        Weight: 15%
        """
        score = 500
        
        # Check GST filing consistency
        gst_filing_rate = data.get("gst_filing_rate", 0)  # 0-1
        if gst_filing_rate == 1.0:  # 100% on-time
            score += 300
        elif gst_filing_rate > 0.9:  # 90%+ on-time
            score += 200
        elif gst_filing_rate > 0.7:
            score += 100
        else:
            score -= 100
        
        # Check EPFO compliance
        epfo_compliant = data.get("epfo_compliant", False)
        if epfo_compliant:
            score += 150
        
        # Check for penalties
        penalty_count = data.get("compliance_penalties", 0)
        if penalty_count == 0:
            score += 100
        elif penalty_count <= 2:
            score += 0
        else:
            score -= 150
        
        return min(1000, max(0, score))
    
    @staticmethod
    def calculate_financial_discipline(data: Dict[str, Any]) -> int:
        """
        Evaluates responsible money management.
        Weight: 10%
        """
        score = 500
        
        # Check for bounced payments
        bounced_payments = data.get("bounced_payments_12m", 0)
        if bounced_payments == 0:
            score += 300
        elif bounced_payments <= 2:
            score += 100
        else:
            score -= 200
        
        # Check utility payment consistency
        utility_payment_rate = data.get("utility_payment_rate", 0)
        if utility_payment_rate > 0.95:
            score += 150
        elif utility_payment_rate > 0.8:
            score += 75
        
        # Check overdraft usage
        overdraft_usage = data.get("overdraft_usage_frequency", "low")
        if overdraft_usage == "none":
            score += 100
        elif overdraft_usage == "low":
            score += 50
        elif overdraft_usage == "high":
            score -= 100
        
        return min(1000, max(0, score))
    
    @staticmethod
    def calculate_growth(data: Dict[str, Any]) -> int:
        """
        Evaluates business growth trajectory.
        Weight: 10%
        """
        score = 500
        
        # Check YoY growth
        yoy_growth = data.get("yoy_revenue_growth", 0)  # Percentage
        if yoy_growth > 20:  # 20%+ growth
            score += 300
        elif yoy_growth > 10:
            score += 200
        elif yoy_growth > 0:
            score += 100
        else:
            score -= 100
        
        # Check customer base growth
        customer_growth = data.get("customer_base_growth", 0)
        if customer_growth > 15:
            score += 150
        elif customer_growth > 5:
            score += 75
        
        return min(1000, max(0, score))
    
    @staticmethod
    def calculate_business_network(data: Dict[str, Any]) -> int:
        """
        Evaluates quality and diversity of business relationships.
        Weight: 10%
        """
        score = 500
        
        # Check customer concentration
        top_customer_share = data.get("top_customer_revenue_share", 0)  # Percentage
        if top_customer_share < 20:  # Well diversified
            score += 300
        elif top_customer_share < 35:
            score += 200
        elif top_customer_share < 50:
            score += 100
        else:  # High concentration
            score -= 100
        
        # Check supplier diversity
        unique_suppliers = data.get("unique_suppliers", 0)
        if unique_suppliers > 20:
            score += 150
        elif unique_suppliers > 10:
            score += 75
        
        # Check relationship longevity
        avg_relationship_months = data.get("avg_customer_relationship_months", 0)
        if avg_relationship_months > 24:
            score += 100
        elif avg_relationship_months > 12:
            score += 50
        
        return min(1000, max(0, score))

# Create a global rules instance
rules = FinancialHealthRules()