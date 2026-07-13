"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, AlertTriangle, CheckCircle, Loader2,
  BarChart3, PieChart as PieIcon, LineChart as LineIcon, Users, DollarSign, Shield
} from "lucide-react";

const COLORS = ["#003366", "#0066CC", "#3399FF", "#66B2FF", "#99CCFF"];
const RISK_COLORS = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };

export default function PortfolioPage() {
  const [overview, setOverview] = useState<any>(null);
  const [riskDist, setRiskDist] = useState<any>(null);
  const [timeSeries, setTimeSeries] = useState<any>(null);
  const [aiVsHuman, setAiVsHuman] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ov, risk, ts, ai] = await Promise.all([
          api.getPortfolioOverview(),
          api.getRiskDistribution(),
          api.getTimeSeries(30),
          api.getAIvsHuman()
        ]);
        setOverview(ov);
        setRiskDist(risk);
        setTimeSeries(ts);
        setAiVsHuman(ai);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-12 h-12 text-[#003366]" />
      </div>
    );
  }

  const riskChartData = riskDist ? [
    { name: "Low Risk", value: riskDist.low_risk.count, color: RISK_COLORS.Low },
    { name: "Medium Risk", value: riskDist.medium_risk.count, color: RISK_COLORS.Medium },
    { name: "High Risk", value: riskDist.high_risk.count, color: RISK_COLORS.High }
  ] : [];

  const tierChartData = overview ? Object.entries(overview.tier_distribution).map(([tier, count]) => ({
    tier: tier.replace('_', ' '),
    count
  })) : [];

  const timeSeriesData = timeSeries?.daily_applications || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Portfolio Analytics</h1>
        <p className="text-slate-500 mt-2">Real-time insights into your MSME lending portfolio</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Applications</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{overview?.total_applications || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Exposure</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">₹{((overview?.total_loan_amount || 0) / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Health Score</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{overview?.average_health_score || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Approval Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{overview?.approval_rate || 0}%</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-[#003366]" /> Risk Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#003366]" /> Tier Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="tier" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" fill="#003366" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <LineIcon className="w-5 h-5 text-[#003366]" /> Applications Over Time (Last 30 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#003366" strokeWidth={2} dot={{ fill: '#003366', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI vs Human */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#003366]" /> AI vs Manual Assessment
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-600 font-medium">AI Auto-Assessed</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{aiVsHuman?.ai_auto_assessed || 0}</p>
              <p className="text-xs text-blue-700 mt-1">{aiVsHuman?.ai_percentage || 0}% of portfolio</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <p className="text-sm text-orange-600 font-medium">Manual Assessment Required</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{aiVsHuman?.manual_assessment || 0}</p>
              <p className="text-xs text-orange-700 mt-1">Tier 3 (Zero-Digital) applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Portfolio Summary</h3>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Metric</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Value</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Insight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium">Average Loan Size</td>
              <td className="px-4 py-3">₹{((overview?.average_loan_amount || 0) / 100000).toFixed(1)}L</td>
              <td className="px-4 py-3 text-sm text-slate-600">Typical MSME working capital loan</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Average Confidence Score</td>
              <td className="px-4 py-3">{overview?.average_confidence || 0}%</td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {(overview?.average_confidence || 0) > 80 ? "High data quality" : "Room for improvement"}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Pending Reviews</td>
              <td className="px-4 py-3">{overview?.pending_reviews || 0}</td>
              <td className="px-4 py-3 text-sm text-slate-600">Requires officer attention</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Low Risk Applications</td>
              <td className="px-4 py-3 text-green-600 font-bold">{riskDist?.low_risk?.count || 0}</td>
              <td className="px-4 py-3 text-sm text-slate-600">Health score 700+</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">High Risk Applications</td>
              <td className="px-4 py-3 text-red-600 font-bold">{riskDist?.high_risk?.count || 0}</td>
              <td className="px-4 py-3 text-sm text-slate-600">Health score below 400</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}