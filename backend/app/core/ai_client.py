import httpx
import json
import logging
import time
import asyncio
from typing import Dict, Any, Tuple
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_last_ai_call_time = 0.0
_AI_RATE_LIMIT_SECONDS = 25.0 
_rate_limit_lock = asyncio.Lock()

class AIClient:
    def __init__(self):
        self.api_url = settings.AI_API_URL
        self.api_key = settings.AI_API_KEY
        self.timeout = 60.0 
    
    async def _enforce_rate_limit(self):
        global _last_ai_call_time
        async with _rate_limit_lock:
            current_time = time.time()
            time_since_last_call = current_time - _last_ai_call_time
            
            if time_since_last_call < _AI_RATE_LIMIT_SECONDS:
                wait_time = _AI_RATE_LIMIT_SECONDS - time_since_last_call
                logger.info(f"⏳ Rate limit active. Queuing request and waiting {wait_time:.1f} seconds...")
                await asyncio.sleep(wait_time)
                
            _last_ai_call_time = time.time()
            logger.info("✅ Rate limit cleared. Proceeding with AI API call.")

    async def generate_full_assessment(self, rich_context: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
        await self._enforce_rate_limit()

        context_str = json.dumps(rich_context, indent=2)
        business_name = rich_context.get("business_name", "The MSME")
        gstin = rich_context.get("gstin", "Unknown")
        
        # UPDATED MASTER PROMPT
        prompt = f"""
You are an expert MSME Credit Officer and Senior Market Risk Analyst at IDBI Bank.
Analyze the provided business data for {business_name} (GSTIN: {gstin}) and generate a comprehensive assessment.

RULES:
1. You must output ONLY valid JSON. Do not include markdown formatting like ```json or ```.
2. Do not invent financial numbers. Use only the provided context for the summary.
3. Explicitly mention the business name in the executive summary.
4. For the market context, use your pre-trained knowledge of the specified industry and location.
5. Do not use markdown asterisks like **Recommendation:** in the text.

REQUIRED JSON STRUCTURE:
{{
  "executive_summary": "A concise, professional 3-4 sentence summary of the financial health, strengths, risks, and recommendation for {business_name}.",
  "market_context": {{
    "overall_outlook": "Positive/Neutral/Negative",
    "industry_trends": ["Trend 1", "Trend 2"],
    "supply_chain_risks": ["Risk 1", "Risk 2"],
    "competitive_landscape": "Brief analysis of local market saturation",
    "regulatory_headwinds": ["Regulation 1", "Regulation 2"]
  }}
}}

BUSINESS CONTEXT:
{context_str}
"""
        
        try:
            logger.info("🚀 Sending Master Prompt to AI...")
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.api_url,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}"
                    },
                    json={"message": prompt, "model": "apifreellm"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success"):
                        logger.info("✅ AI API responded successfully")
                        raw_text = data.get("response", "")
                        clean_text = raw_text.replace("```json", "").replace("```", "").strip()
                        
                        try:
                            parsed_json = json.loads(clean_text)
                            summary = parsed_json.get("executive_summary", "Summary generation failed.")
                            market = parsed_json.get("market_context", {})
                            return summary, market
                        except json.JSONDecodeError as e:
                            logger.error(f"❌ AI returned invalid JSON: {e}")
                            return raw_text, self._get_timeout_fallback()
                elif response.status_code == 429:
                    logger.error("❌ AI API returned 429 Rate Limit!")
                    return "AI rate limit exceeded. Please try again in a minute.", self._get_timeout_fallback()
                else:
                    logger.error(f"❌ AI API Error: {response.status_code} - {response.text}")
                    
        except httpx.TimeoutException:
            logger.error("⏱️ AI API timed out after 60 seconds.")
        except Exception as e:
            logger.error(f"❌ Unexpected Error: {str(e)}")
            
        return "AI assessment temporarily unavailable due to API timeout. Please try again.", self._get_timeout_fallback()

    def _get_timeout_fallback(self):
        return {
            "overall_outlook": "Pending",
            "industry_trends": ["Market analysis unavailable due to AI API timeout."],
            "supply_chain_risks": ["Data unavailable."],
            "competitive_landscape": "Data unavailable.",
            "regulatory_headwinds": ["Data unavailable."]
        }

ai_client = AIClient()