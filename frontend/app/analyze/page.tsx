"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  Filter, Download, Search, ChevronDown, ChevronUp, 
  TrendingUp, AlertTriangle, CheckCircle, Loader2,
  BarChart3, PieChart as PieIcon, LineChart as LineIcon
} from "lucide-react";

interface ApplicationData {
  id: number;
  business_name: string | null;
  pan: string;
  gstin: string | null;
  applied_amount: number;
  tier: string;
  status: string;
  created_at: string;
  health_score: number | null;
  confidence_score: number | null;
  risk_level: string | null;
}

interface Filters {
  search: string;
  tiers: string[];
  statuses: string[];
  riskLevels: string[];
  minScore: number | null;
  maxScore: number | null;
  dateFrom: string;
  dateTo: string;
}

const COLORS = ["#003366", "#0066CC", "#3399FF", "#66B2FF", "#99CCFF"];
const RISK_COLORS = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444" };

export default function AnalyzePage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "business_name", "pan", "applied_amount", "tier", "status", 
    "health_score", "risk_level", "created_at"
  ]);
  
  const [filters, setFilters] = useState<Filters>({
    search: "",
    tiers: [],
    statuses: [],
    riskLevels: [],
    minScore: null,
    maxScore: null,
    dateFrom: "",
    dateTo: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getDetailedApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filterType: keyof Filters, value: string) => {
    const currentArray = filters[filterType] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    
    setFilters({ ...filters, [filterType]: newArray });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      tiers: [],
      statuses: [],
      riskLevels: [],
      minScore: null,
      maxScore: null,
      dateFrom: "",
      dateTo: ""
    });
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const exportToCSV = () => {
    const headers = selectedColumns.join(",");
    const rows = filteredApplications.map(app => 
      selectedColumns.map(col => {
        const value = app[col as keyof ApplicationData];
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value || "";
      }).join(",")
    );
    
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications_analytics.csv";
    a.click();
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const filteredApplications = applications.filter(app => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matches = 
        (app.business_name?.toLowerCase().includes(search)) ||
        app.pan.toLowerCase().includes(search) ||
        (app.gstin?.toLowerCase().includes(search));
      if (!matches) return false;
    }
    if (filters.tiers.length > 0 && !filters.tiers.includes(app.tier)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(app.status)) return false;
    if (filters.riskLevels.length > 0 && (!app.risk_level || !filters.riskLevels.includes(app.risk_level))) return false;
    if (filters.minScore !== null && (app.health_score === null || app.health_score < filters.minScore)) return false;
    if (filters.maxScore !== null && (app.health_score === null || app.health_score > filters.maxScore)) return false;
    if (filters.dateFrom && new Date(app.created_at) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(app.created_at) > new Date(filters.dateTo)) return false;
    return true;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const aVal = a[sortColumn as keyof ApplicationData];
    const bVal = b[sortColumn as keyof ApplicationData];
    
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const metrics = {
    total: filteredApplications.length,
    avgScore: filteredApplications.reduce((sum, app) => sum + (app.health_score || 0), 0) / filteredApplications.length || 0,
    avgAmount: filteredApplications.reduce((sum, app) => sum + app.applied_amount, 0) / filteredApplications.length || 0,
    lowRisk: filteredApplications.filter(app => app.risk_level === "Low").length,
    mediumRisk: filteredApplications.filter(app => app.risk_level === "Medium").length,
    highRisk: filteredApplications.filter(app => app.risk_level === "High").length
  };

  const riskDistributionData = [
    { name: "Low Risk", value: metrics.lowRisk, color: RISK_COLORS.Low },
    { name: "Medium Risk", value: metrics.mediumRisk, color: RISK_COLORS.Medium },
    { name: "High Risk", value: metrics.highRisk, color: RISK_COLORS.High }
  ];

  const tierDistribution = filteredApplications.reduce((acc, app) => {
    acc[app.tier] = (acc[app.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tierChartData = Object.entries(tierDistribution).map(([tier, count]) => ({
    tier,
    count
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#003366]" />
      </div>
    );
  }

  const allColumns = [
    { key: "business_name", label: "Business Name" },
    { key: "pan", label: "PAN" },
    { key: "gstin", label: "GSTIN" },
    { key: "applied_amount", label: "Amount (₹)" },
    { key: "tier", label: "Tier" },
    { key: "status", label: "Status" },
    { key: "health_score", label: "Health Score" },
    { key: "confidence_score", label: "Confidence" },
    { key: "risk_level", label: "Risk Level" },
    { key: "created_at", label: "Created" }
  ];

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Deep Analytics Workspace</h1>
          <p className="text-slate-500 mt-1">Interactive data exploration and pivot analysis</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500">Total Applications</p>
          <p className="text-2xl font-bold text-slate-900">{metrics.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500">Avg Health Score</p>
          <p className="text-2xl font-bold text-blue-600">{metrics.avgScore.toFixed(0)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <p className="text-xs text-slate-500">Avg Amount</p>
          <p className="text-2xl font-bold text-slate-900">₹{(metrics.avgAmount / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
          <p className="text-xs text-green-600">Low Risk</p>
          <p className="text-2xl font-bold text-green-600">{metrics.lowRisk}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-200">
          <p className="text-xs text-yellow-600">Medium Risk</p>
          <p className="text-2xl font-bold text-yellow-600">{metrics.mediumRisk}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
          <p className="text-xs text-red-600">High Risk</p>
          <p className="text-2xl font-bold text-red-600">{metrics.highRisk}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5" /> Risk Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Tier Distribution
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

      {/* Filters Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              Showing {filteredApplications.length} of {applications.length}
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="p-6 space-y-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search by business name, PAN, or GSTIN..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>

            {/* Tier Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Tier</label>
              <div className="flex gap-2 flex-wrap">
                {["TIER_1", "TIER_2", "TIER_3"].map(tier => (
                  <button
                    key={tier}
                    onClick={() => toggleFilter("tiers", tier)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      filters.tiers.includes(tier)
                        ? "bg-[#003366] text-white border-[#003366]"
                        : "bg-white text-slate-600 border-slate-300"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Status</label>
              <div className="flex gap-2 flex-wrap">
                {["Processing", "Reviewed", "Approved", "Rejected"].map(status => (
                  <button
                    key={status}
                    onClick={() => toggleFilter("statuses", status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      filters.statuses.includes(status)
                        ? "bg-[#003366] text-white border-[#003366]"
                        : "bg-white text-slate-600 border-slate-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Level Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Risk Level</label>
              <div className="flex gap-2 flex-wrap">
                {["Low", "Medium", "High"].map(risk => (
                  <button
                    key={risk}
                    onClick={() => toggleFilter("riskLevels", risk)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      filters.riskLevels.includes(risk)
                        ? "bg-[#003366] text-white border-[#003366]"
                        : "bg-white text-slate-600 border-slate-300"
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            {/* Score Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Health Score Range</label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minScore || ""}
                  onChange={(e) => setFilters({ ...filters, minScore: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-32 px-3 py-2 border border-slate-300 rounded-lg"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxScore || ""}
                  onChange={(e) => setFilters({ ...filters, maxScore: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-32 px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Date Range</label>
              <div className="flex gap-4 items-center">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg"
                />
                <span className="text-slate-500">to</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Column Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Visible Columns</h3>
        <div className="flex gap-2 flex-wrap">
          {allColumns.map(col => (
            <button
              key={col.key}
              onClick={() => toggleColumn(col.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                selectedColumns.includes(col.key)
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-white text-slate-500 border-slate-300"
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Grid / Pivot Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {selectedColumns.map(col => {
                  const column = allColumns.find(c => c.key === col);
                  return (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        {column?.label}
                        {sortColumn === col && (
                          sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  {selectedColumns.map(col => (
                    <td key={col} className="px-4 py-3 text-sm">
                      {col === "risk_level" && app.risk_level ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          app.risk_level === "Low" ? "bg-green-100 text-green-700" :
                          app.risk_level === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {app.risk_level === "Low" ? <CheckCircle className="w-3 h-3" /> :
                           app.risk_level === "Medium" ? <AlertTriangle className="w-3 h-3" /> :
                           <AlertTriangle className="w-3 h-3" />}
                          {app.risk_level}
                        </span>
                      ) : col === "applied_amount" ? (
                        <span className="font-semibold">₹{(app[col as keyof ApplicationData] as number / 100000).toFixed(1)}L</span>
                      ) : col === "health_score" ? (
                        <span className="font-bold text-blue-600">{app.health_score || "N/A"}</span>
                      ) : col === "confidence_score" ? (
                        <span>{app.confidence_score ? `${app.confidence_score}%` : "N/A"}</span>
                      ) : col === "created_at" ? (
                        <span className="text-slate-500">{new Date(app.created_at).toLocaleDateString()}</span>
                      ) : (
                        <span>{app[col as keyof ApplicationData] as string || "N/A"}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}