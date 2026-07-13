"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { Assessment, Application } from "@/types";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip 
} from "recharts";
import { Shield, TrendingUp, AlertTriangle, CheckCircle2, Loader2, AlertCircle, Globe, Factory, Scale, Camera, Package } from "lucide-react";
import { useAppStore } from "@/lib/store";
import DocumentUploader from "@/components/documents/document-uploader";
import { QRCodeSVG } from "qrcode.react";

export default function AssessmentPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [app, setApp] = useState<Application | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const { isAIGenerating, setAIGenerating } = useAppStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appData = await api.getApplication(parseInt(id));
        setApp(appData);
        try {
          const assessData = await api.getAssessment(parseInt(id));
          setAssessment(assessData);
        } catch (e) {}
      } catch (e) {
        console.error("Failed to fetch application");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setAIGenerating(true);
    try {
      const data = await api.generateAssessment(parseInt(id));
      setAssessment(data);
    } catch (e) {
      alert("Failed to generate assessment");
    } finally {
      setGenerating(false);
      setAIGenerating(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-[#003366]" /></div>;
  if (!app) return <div className="p-10 text-center text-slate-500">Application not found</div>;

  const radarData = assessment && assessment.dimension_scores ? [
    { dimension: 'Cash Flow', score: assessment.dimension_scores.cash_flow, fullMark: 1000 },
    { dimension: 'Activity', score: assessment.dimension_scores.business_activity, fullMark: 1000 },
    { dimension: 'Stability', score: assessment.dimension_scores.business_stability, fullMark: 1000 },
    { dimension: 'Compliance', score: assessment.dimension_scores.compliance, fullMark: 1000 },
    { dimension: 'Discipline', score: assessment.dimension_scores.financial_discipline, fullMark: 1000 },
    { dimension: 'Growth', score: assessment.dimension_scores.growth, fullMark: 1000 },
    { dimension: 'Network', score: assessment.dimension_scores.business_network, fullMark: 1000 },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{app.business_name || "Unregistered MSME"}</h1>
            <p className="text-slate-500 mt-1">PAN: {app.pan} • GSTIN: {app.gstin || "Not Registered"} • Applied: ₹{(app.applied_amount / 100000).toFixed(1)}L</p>
          </div>
          <div className="flex items-center gap-4">
            {!assessment && (
              <button 
                onClick={handleGenerate}
                disabled={generating}
                className="px-6 py-3 bg-[#003366] text-white rounded-lg font-medium hover:bg-[#004080] disabled:opacity-50 flex items-center gap-2"
              >
                {generating ? <Loader2 className="animate-spin w-4 h-4" /> : "Generate Health Card"}
              </button>
            )}
            
            {assessment && (
              <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-3">
                <QRCodeSVG value={`http://localhost:3000/application/${id}`} size={40} />
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Quick Access</p>
                  <p className="text-slate-500">Scan to open on mobile</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {assessment && assessment.confidence_score !== null && assessment.confidence_score < 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800">Action Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Confidence is below 80% ({assessment.confidence_score}%). Please request additional documents in the Decision Workspace.
              </p>
            </div>
          </div>
        )}

        {assessment && (
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            <Link href={`/application/${id}`} className="px-4 py-2 text-sm font-medium text-[#003366] border-b-2 border-[#003366]">Overview</Link>
            <Link href={`/application/${id}/dimensions`} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900">Dimensions</Link>
            <Link href={`/application/${id}/evidence`} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900">Evidence & Verification</Link>
            <Link href={`/application/${id}/documents`} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900">Documents</Link>
            <Link href={`/application/${id}/decision`} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900">Decision Workspace</Link>
          </div>
        )}
      </div>

      {assessment ? (
        <>
          {/* TIER 3 UI: ZERO DIGITAL FOOTPRINT */}
          {assessment.health_score === null && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                <Camera className="w-5 h-5" /> Zero-Digital Profile Detected (Tier 3)
              </h2>
              <p className="text-purple-700 mt-2">
                No digital financial footprint found. Initiating <strong>Digital Site Visit</strong> workflow.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center bg-white cursor-pointer hover:bg-purple-50 transition-colors">
                  <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">Upload Shopfront Photo</p>
                  <p className="text-xs text-slate-500">AI Vision will estimate location value</p>
                </div>
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center bg-white cursor-pointer hover:bg-purple-50 transition-colors">
                  <Package className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">Upload Inventory Photo</p>
                  <p className="text-xs text-slate-500">AI Vision will estimate asset value</p>
                </div>
              </div>

              {assessment.physical_assessment && (
                <div className="mt-6 bg-white p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-slate-900 mb-2">AI Vision Analysis Result:</h3>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• <strong>Assets Detected:</strong> {assessment.physical_assessment.ai_vision_assets.join(", ")}</li>
                    <li>• <strong>Estimated Asset Value:</strong> ₹{assessment.physical_assessment.estimated_asset_value.toLocaleString()}</li>
                    <li>• <strong>Recommended Scheme:</strong> {assessment.physical_assessment.scheme}</li>
                    <li>• <strong>Max Loan Eligible:</strong> ₹{assessment.physical_assessment.recommended_loan.toLocaleString()}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STANDARD HEALTH CARD UI (TIER 1 & 2) */}
          {assessment.health_score !== null && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Financial Health Score</p>
                      <p className="text-5xl font-bold text-[#003366] mt-2">{assessment.health_score}</p>
                      <p className="text-xs text-slate-400 mt-1">Out of 1000</p>
                    </div>
                    <div className={`p-3 rounded-full ${assessment.health_score > 700 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Industry Benchmark: <span className="font-bold text-slate-700">{assessment.industry_benchmark}</span></p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Assessment Confidence</p>
                      <p className="text-5xl font-bold text-slate-900 mt-2">{assessment.confidence_score}%</p>
                      <p className="text-xs text-slate-400 mt-1">Data Reliability</p>
                    </div>
                    <div className={`p-3 rounded-full ${assessment.confidence_score > 80 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      <Shield className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Status: <span className="font-bold text-slate-700">
                      {assessment.confidence_score > 80 ? 'Highly Reliable' : 'Moderate - Verify Gaps'}
                    </span></p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Trust & Verification</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-4 h-4 rounded-full ${
                          assessment.trust_status === 'GREEN' ? 'bg-green-500' : 
                          assessment.trust_status === 'YELLOW' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <p className="text-2xl font-bold text-slate-900">
                          {assessment.trust_status === 'GREEN' ? 'Trusted' : 
                           assessment.trust_status === 'YELLOW' ? 'Needs Verification' : 'Suspicious'}
                        </p>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${
                      assessment.trust_status === 'GREEN' ? 'bg-green-100 text-green-600' : 
                      assessment.trust_status === 'YELLOW' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">Evidence Consistency Check</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#003366] rounded-full"></span>
                    AI Executive Summary
                  </h3>
                  
                  {isAIGenerating ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <p className="text-xs text-slate-400 mt-4 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" /> Analyzing transactions and cross-verifying data...
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-600 leading-relaxed text-sm">{assessment.ai_executive_summary}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Key Strengths</h4>
                      <ul className="space-y-2">
                        {assessment.strengths?.slice(0, 2).map((s, i) => (
                          <li key={i} className="text-xs text-slate-600 bg-green-50 p-2 rounded border border-green-100">{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Critical Risks</h4>
                      <ul className="space-y-2">
                        {assessment.risks?.slice(0, 2).map((r, i) => (
                          <li key={i} className="text-xs text-slate-600 bg-red-50 p-2 rounded border border-red-100">{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">7-Dimension Health</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Radar name="Score" dataKey="score" stroke="#003366" fill="#003366" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {!isAIGenerating && assessment.market_context && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#003366]" /> AI Market & Industry Context
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-600" /> Industry Trends</h4>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${assessment.market_context.overall_outlook.includes('Positive') ? 'bg-green-100 text-green-700' : assessment.market_context.overall_outlook.includes('Negative') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            Outlook: {assessment.market_context.overall_outlook}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {assessment.market_context.industry_trends.map((trend, i) => (
                            <li key={i} className="text-xs text-slate-600 bg-blue-50 p-2 rounded border border-blue-100 flex gap-2"><span className="text-blue-500">•</span> {trend}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2"><Factory className="w-4 h-4 text-purple-600" /> Competitive Landscape</h4>
                        <p className="text-xs text-slate-600 bg-purple-50 p-2 rounded border border-purple-100">{assessment.market_context.competitive_landscape}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-orange-600" /> Supply Chain Risks</h4>
                        <ul className="space-y-2">
                          {assessment.market_context.supply_chain_risks.map((risk, i) => (
                            <li key={i} className="text-xs text-slate-600 bg-orange-50 p-2 rounded border border-orange-100 flex gap-2"><span className="text-orange-500">•</span> {risk}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2"><Scale className="w-4 h-4 text-slate-600" /> Regulatory Headwinds</h4>
                        <ul className="space-y-2">
                          {assessment.market_context.regulatory_headwinds.map((reg, i) => (
                            <li key={i} className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 flex gap-2"><span className="text-slate-500">•</span> {reg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Health Trend (6 Months)</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={assessment.health_timeline}>
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[600, 1000]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#003366" strokeWidth={3} dot={{ fill: '#003366', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="bg-white p-20 rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-slate-500 mb-4">No assessment generated yet.</p>
          <button onClick={handleGenerate} className="px-6 py-3 bg-[#003366] text-white rounded-lg font-medium hover:bg-[#004080]">Generate Financial Health Card</button>
        </div>
      )}
    </div>
  );
}