"""
Confidence Engine: Calculates the 0-100% Confidence Score
based on data quality, completeness, and consistency.
"""

from typing import Dict, Any, List

class ConfidenceEngine:
    """
    Evaluates how much the credit officer should trust the Health Score
    based on the quality and completeness of the underlying data.
    """
    
    # Factor weights (must sum to 100%)
    WEIGHTS = {
        "data_completeness": 0.30,
        "source_reliability": 0.25,
        "cross_verification": 0.20,
        "data_freshness": 0.15,
        "coverage": 0.10
    }
    
    def calculate(self, data_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates the Confidence Score and breakdown.
        
        Returns:
            {
                "confidence_score": 72.5,
                "breakdown": {
                    "data_completeness": 25.0,
                    "source_reliability": 20.0,
                    ...
                },
                "available_sources": [...],
                "missing_sources": [...]
            }
        """
        breakdown = {}
        
        # Calculate each factor
        breakdown["data_completeness"] = self._calculate_completeness(data_metadata)
        breakdown["source_reliability"] = self._calculate_reliability(data_metadata)
        breakdown["cross_verification"] = self._calculate_cross_verification(data_metadata)
        breakdown["data_freshness"] = self._calculate_freshness(data_metadata)
        breakdown["coverage"] = self._calculate_coverage(data_metadata)
        
        # Calculate weighted sum
        confidence_score = self._calculate_weighted_sum(breakdown)
        
        # Extract available and missing sources
        available_sources = data_metadata.get("available_sources", [])
        missing_sources = data_metadata.get("missing_sources", [])
        
        return {
            "confidence_score": round(confidence_score, 1),
            "breakdown": breakdown,
            "available_sources": available_sources,
            "missing_sources": missing_sources
        }
    
    def _calculate_completeness(self, metadata: Dict[str, Any]) -> float:
        """
        Evaluates how much of the required data is present.
        Max score: 30 points
        """
        available_count = len(metadata.get("available_sources", []))
        required_count = 6  # GST, AA, UPI, EPFO, Utility, Trade Ref
        
        completeness_ratio = available_count / required_count
        return completeness_ratio * 30.0
    
    def _calculate_reliability(self, metadata: Dict[str, Any]) -> float:
        """
        Evaluates the trustworthiness of data sources.
        Max score: 25 points
        """
        sources = metadata.get("available_sources", [])
        if not sources:
            return 0.0
        
        reliability_scores = {
            "GST": 10,
            "Bank Statements (AA)": 10,
            "UPI": 8,
            "EPFO": 9,
            "Utility Bills": 7,
            "Trade References": 5
        }
        
        total_reliability = sum(reliability_scores.get(s.get("source"), 0) for s in sources)
        max_reliability = sum(reliability_scores.values())
        
        return (total_reliability / max_reliability) * 25.0
    
    def _calculate_cross_verification(self, metadata: Dict[str, Any]) -> float:
        """
        Evaluates consistency across different data sources.
        Max score: 20 points
        """
        cross_verification = metadata.get("cross_verification_matrix", {})
        if not cross_verification:
            return 10.0  # Neutral score if no verification data
        
        green_count = sum(1 for v in cross_verification.values() if v.get("status") == "GREEN")
        total_checks = len(cross_verification)
        
        if total_checks == 0:
            return 10.0
        
        consistency_ratio = green_count / total_checks
        return consistency_ratio * 20.0
    
    def _calculate_freshness(self, metadata: Dict[str, Any]) -> float:
        """
        Evaluates how recent the data is.
        Max score: 15 points
        """
        sources = metadata.get("available_sources", [])
        if not sources:
            return 0.0
        
        freshness_scores = {
            "Today": 15,
            "Yesterday": 12,
            "2 days ago": 10,
            "1 week ago": 7,
            "1 month ago": 3
        }
        
        total_freshness = sum(
            freshness_scores.get(s.get("freshness", "1 month ago"), 0)
            for s in sources
        )
        max_freshness = len(sources) * 15
        
        return (total_freshness / max_freshness) * 15.0
    
    def _calculate_coverage(self, metadata: Dict[str, Any]) -> float:
        """
        Evaluates the breadth of data sources.
        Max score: 10 points
        """
        available_count = len(metadata.get("available_sources", []))
        
        if available_count >= 5:
            return 10.0
        elif available_count >= 4:
            return 8.0
        elif available_count >= 3:
            return 6.0
        elif available_count >= 2:
            return 4.0
        else:
            return 2.0
    
    def _calculate_weighted_sum(self, breakdown: Dict[str, float]) -> float:
        """
        Calculates the weighted sum of all factors.
        """
        return sum(breakdown.values())

# Create a global engine instance
confidence_engine = ConfidenceEngine()