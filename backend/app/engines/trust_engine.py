"""
Trust Engine: Determines the Trust & Verification Status
based on data consistency and anomaly detection.
"""

from typing import Dict, Any, List

class TrustEngine:
    """
    Evaluates the consistency and reliability of the underlying evidence
    and assigns a traffic-light trust status.
    """
    
    def evaluate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates trust status based on cross-verification and anomalies.
        
        Returns:
            {
                "trust_status": "YELLOW",
                "anomalies": [...],
                "verification_flags": [...]
            }
        """
        anomalies = []
        verification_flags = []
        
        # Check cross-verification mismatches
        cross_verification = data.get("cross_verification_matrix", {})
        red_flags = self._check_cross_verification(cross_verification)
        verification_flags.extend(red_flags)
        
        # Check for statistical anomalies
        statistical_anomalies = self._detect_anomalies(data)
        anomalies.extend(statistical_anomalies)
        
        # Determine overall trust status
        trust_status = self._determine_status(verification_flags, anomalies)
        
        return {
            "trust_status": trust_status,
            "anomalies": anomalies,
            "verification_flags": verification_flags
        }
    
    def _check_cross_verification(self, cross_verification: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Checks for mismatches between different data sources.
        """
        flags = []
        
        for metric, data in cross_verification.items():
            status = data.get("status", "UNKNOWN")
            delta = data.get("delta_percent", 0)
            
            if status == "RED":
                flags.append({
                    "type": "CROSS_VERIFICATION_MISMATCH",
                    "severity": "HIGH",
                    "metric": data.get("metric", metric),
                    "delta_percent": delta,
                    "explanation": data.get("explanation", "Major mismatch detected")
                })
            elif status == "YELLOW" or delta > 10:
                flags.append({
                    "type": "CROSS_VERIFICATION_WARNING",
                    "severity": "MEDIUM",
                    "metric": data.get("metric", metric),
                    "delta_percent": delta,
                    "explanation": data.get("explanation", "Minor mismatch detected")
                })
        
        return flags
    
    def _detect_anomalies(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Detects statistical anomalies in the data.
        In production, this would use ML (Isolation Forests).
        For the prototype, we use rule-based detection.
        """
        anomalies = []
        
        # Check for sudden spikes
        monthly_inflows = data.get("monthly_inflows", [])
        if len(monthly_inflows) >= 3:
            recent_avg = sum(monthly_inflows[-3:]) / 3
            historical_avg = sum(monthly_inflows[:-3]) / max(1, len(monthly_inflows) - 3)
            
            if historical_avg > 0:
                spike_ratio = recent_avg / historical_avg
                if spike_ratio > 2.0:  # 100%+ increase
                    anomalies.append({
                        "type": "SUDDEN_SPIKE",
                        "severity": "MEDIUM",
                        "description": f"Recent 3-month average is {spike_ratio:.1f}x higher than historical average",
                        "recommendation": "Verify if this is sustainable growth or temporary spike"
                    })
        
        # Check for round-trip funding
        round_trip_detected = data.get("round_trip_funding_detected", False)
        if round_trip_detected:
            anomalies.append({
                "type": "ROUND_TRIP_FUNDING",
                "severity": "HIGH",
                "description": "Potential round-trip funding detected (money sent and received back within 24 hours)",
                "recommendation": "Investigate purpose of these transactions"
            })
        
        # Check for cash deposit concentration
        cash_deposit_concentration = data.get("cash_deposit_concentration", 0)
        if cash_deposit_concentration > 0.4:  # 40%+ in last 5 days
            anomalies.append({
                "type": "CASH_DEPOSIT_CONCENTRATION",
                "severity": "MEDIUM",
                "description": f"{cash_deposit_concentration*100:.0f}% of cash deposits occurred in the last 5 days of the month",
                "recommendation": "Verify if this is regular business pattern or end-of-month adjustment"
            })
        
        return anomalies
    
    def _determine_status(self, verification_flags: List[Dict], anomalies: List[Dict]) -> str:
        """
        Determines the overall trust status based on flags and anomalies.
        """
        high_severity_count = (
            sum(1 for f in verification_flags if f.get("severity") == "HIGH") +
            sum(1 for a in anomalies if a.get("severity") == "HIGH")
        )
        
        medium_severity_count = (
            sum(1 for f in verification_flags if f.get("severity") == "MEDIUM") +
            sum(1 for a in anomalies if a.get("severity") == "MEDIUM")
        )
        
        if high_severity_count >= 2:
            return "RED"
        elif high_severity_count >= 1 or medium_severity_count >= 3:
            return "YELLOW"
        else:
            return "GREEN"

# Create a global engine instance
trust_engine = TrustEngine()