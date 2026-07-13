export interface Application {
  id: number;
  business_name: string | null;
  pan: string;
  gstin: string | null;
  applied_amount: number;
  loan_purpose: string | null;
  tier: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DimensionScores {
  cash_flow: number;
  business_activity: number;
  business_stability: number;
  compliance: number;
  financial_discipline: number;
  growth: number;
  business_network: number;
}

export interface MarketContext {
  overall_outlook: string;
  industry_trends: string[];
  supply_chain_risks: string[];
  competitive_landscape: string;
  regulatory_headwinds: string[];
}

export interface PhysicalAssessment {
  shop_type: string;
  ai_vision_assets: string[];
  estimated_asset_value: number;
  foot_traffic_estimate: string;
  recommended_loan: number;
  scheme: string;
}

export interface Assessment {
  id: number;
  application_id: number;
  health_score: number | null;
  confidence_score: number | null;
  trust_status: string | null;
  dimension_scores: DimensionScores | null;
  ai_executive_summary: string | null;
  market_context: MarketContext | null;
  strengths: string[] | null;
  risks: string[] | null;
  cross_verification_matrix: any;
  data_coverage: any;
  industry_benchmark: number | null;
  health_timeline: { month: string; score: number }[] | null;
  generated_at: string;
  data_freshness: any;
  physical_assessment: PhysicalAssessment | null;
}

export interface PortfolioOverview {
  total_applications: number;
  total_loan_amount: number;
  average_loan_amount: number;
  average_health_score: number;
  average_confidence: number;
  pending_reviews: number;
  approval_rate: number;
  status_distribution: Record<string, number>;
  tier_distribution: Record<string, number>;
}

export interface SectorData {
  [sector: string]: { count: number; amount: number; };
}

export interface TimeSeriesData {
  daily_applications: { date: string; count: number }[];
  period_days: number;
}

export interface RiskDistribution {
  low_risk: { count: number; percentage: number };
  medium_risk: { count: number; percentage: number };
  high_risk: { count: number; percentage: number };
}

export interface AIvsHuman {
  ai_auto_assessed: number;
  manual_assessment: number;
  ai_percentage: number;
}

export interface DocumentUploadResponse {
  document_id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_timestamp: string;
  status: string;
  extracted_text: string | null;
  ai_analysis: any;
}

// UPDATED FILTER STATE
export interface FilterState {
  search: string;
  tiers: string[];
  statuses: string[];
  scoreRange: [number, number]; // e.g., [0, 1000]
  amountRange: [number, number]; // e.g., [0, 10000000]
  dateFrom: string;
  dateTo: string;
}