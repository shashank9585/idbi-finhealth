"""
Health Engine: Calculates the 0-1000 Financial Health Score
based on the 7 dimensions.
"""

from typing import Dict, Any
from app.engines.rules import rules

class HealthEngine:
    """
    Orchestrates the calculation of the Financial Health Score
    by evaluating all 7 dimensions and applying their weights.
    """
    
    # Dimension weights (must sum to 100%)
    WEIGHTS = {
        "cash_flow": 0.25,
        "business_activity": 0.15,
        "business_stability": 0.15,
        "compliance": 0.15,
        "financial_discipline": 0.10,
        "growth": 0.10,
        "business_network": 0.10
    }
    
    def calculate(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates the Financial Health Score and all dimension scores.
        
        Returns:
            {
                "health_score": 785,
                "dimension_scores": {
                    "cash_flow": 850,
                    "business_activity": 820,
                    ...
                }
            }
        """
        dimension_scores = {}
        
        # Calculate each dimension
        dimension_scores["cash_flow"] = rules.calculate_cash_flow_health(business_data)
        dimension_scores["business_activity"] = rules.calculate_business_activity(business_data)
        dimension_scores["business_stability"] = rules.calculate_business_stability(business_data)
        dimension_scores["compliance"] = rules.calculate_compliance(business_data)
        dimension_scores["financial_discipline"] = rules.calculate_financial_discipline(business_data)
        dimension_scores["growth"] = rules.calculate_growth(business_data)
        dimension_scores["business_network"] = rules.calculate_business_network(business_data)
        
        # Calculate weighted average
        health_score = self._calculate_weighted_average(dimension_scores)
        
        return {
            "health_score": health_score,
            "dimension_scores": dimension_scores
        }
    
    def _calculate_weighted_average(self, dimension_scores: Dict[str, int]) -> int:
        """
        Calculates the weighted average of all dimension scores.
        """
        weighted_sum = 0
        for dimension, score in dimension_scores.items():
            weight = self.WEIGHTS.get(dimension, 0)
            weighted_sum += score * weight
        
        return int(weighted_sum)

# Create a global engine instance
health_engine = HealthEngine()