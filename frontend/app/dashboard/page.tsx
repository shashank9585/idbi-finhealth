"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { Application, FilterState, Assessment } from "@/types";
import Link from "next/link";
import { ArrowRight, Loader2, Plus, Terminal, Download, CheckSquare, Square } from "lucide-react";
import AdvancedFilters from "@/components/dashboard/advanced-filters";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [assessmentsMap, setAssessmentsMap] = useState<Record<number, Assessment>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFetchModal, setShowFetchModal] = useState(false);
  const [fetchLogs, setFetchLogs] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tiers: [],
    statuses: [],
    scoreRange: [0, 1000],
    amountRange: [0, 10000000],
    dateFrom: "",
    dateTo: "",
  });

  const [formData, setFormData] = useState({
    business_name: "",
    pan: "",
    gstin: "",
    applied_amount: "",
    loan_purpose: "",
    simulate_zero_digital: false
  });

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const apps = await api.getApplications();
      setApplications(apps);
      
      // Fetch assessments to enable score filtering
      const assessMap: Record<number, Assessment> = {};
      for (const app of apps) {
        try {
          const assess = await api.getAssessment(app.id);
          assessMap[app.id] = assess;
        } catch (e) {}
      }
      setAssessmentsMap(assessMap);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setShowFetchModal(true);
    setIsFetching(true);
    setFetchLogs([]);

    const logs = [
      `Initializing secure connection to Account Aggregator network...`,
      `Verifying digital identity for PAN: ${formData.pan}... [SUCCESS]`,
    ];

    if (formData.gstin) {
      logs.push(`Fetching 24 months GST Returns via ULI... [SUCCESS: 24 records parsed]`);
    } else {
      logs.push(`Fetching GST Returns via ULI... [FAILED: GSTIN not provided. Auto-assigning Tier 2]`);
    }

    if (formData.simulate_zero_digital) {
      logs.push(`Fetching Bank Statements via AA... [FAILED: Zero digital footprint detected]`);
      logs.push(`Fetching UPI Transactions... [FAILED: No digital exhaust found]`);
      logs.push(`Auto-assigning Tier 3 (Zero-Digital). Initiating Physical Assessment workflow...`);
    } else {
      logs.push(`Fetching 12 months Bank Statements via AA... [SUCCESS: ${Math.floor(Math.random() * 5000) + 12000} transactions parsed]`);
      logs.push(`Fetching UPI Transactions... [SUCCESS: ${Math.floor(Math.random() * 2000) + 500} records parsed]`);
      logs.push(`Alternate data ingestion complete. Initializing Assessment Engines...`);
    }

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setFetchLogs(prev => [...prev, logs[i]]);
    }

    try {
      const app = await api.createApplication({
        business_name: formData.business_name,
        pan: formData.pan,
        gstin: formData.gstin,
        applied_amount: parseFloat(formData.applied_amount),
        loan_purpose: formData.loan_purpose,
        simulate_zero_digital: formData.simulate_zero_digital
      } as any);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/application/${app.id}`);
    } catch (err) {
      alert("Failed to create application");
      setShowFetchModal(false);
      setIsFetching(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map(a => a.id));
    }
  };

  const handleBulkExport = (format: 'csv' | 'pdf') => {
    const data = applications.filter(a => selectedIds.includes(a.id));
    if (data.length === 0) return alert("Select applications first");

    if (format === 'csv') {
      const csv = [
        "ID,Business Name,PAN,GSTIN,Amount,Tier,Status",
        ...data.map(a => `${a.id},"${a.business_name || ''}",${a.pan},${a.gstin || ''},${a.applied_amount},${a.tier},${a.status}`)
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "applications.csv"; a.click();
    } else {
      const doc = new jsPDF();
      doc.text("IDBI FinHealth - Portfolio Export", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['ID', 'Business Name', 'PAN', 'Amount', 'Tier', 'Status']],
        body: data.map(a => [
          a.id, 
          a.business_name || 'Unregistered', 
          a.pan, 
          `₹${(a.applied_amount/100000).toFixed(1)}L`, 
          a.tier, 
          a.status
        ]),
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102] }
      });
      doc.save("portfolio_export.pdf");
    }
  };

  const getTierBadge = (tier: string) => {
    const styles: Record<string, string> = {
      "TIER_1": "bg-green-100 text-green-700",
      "TIER_2": "bg-yellow-100 text-yellow-700",
      "TIER_3": "bg-purple-100 text-purple-700",
    };
    const labels: Record<string, string> = {
      "TIER_1": "Tier 1",
      "TIER_2": "Tier 2",
      "TIER_3": "Tier 3",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[tier] || "bg-slate-100 text-slate-700"}`}>
        {labels[tier] || tier}
      </span>
    );
  };

  // UPDATED FILTER LOGIC
  const filteredApplications = applications.filter(app => {
    // 1. Search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matches = 
        (app.business_name?.toLowerCase().includes(search)) ||
        app.pan.toLowerCase().includes(search) ||
        (app.gstin?.toLowerCase().includes(search));
      if (!matches) return false;
    }
    // 2. Tiers
    if (filters.tiers.length > 0 && !filters.tiers.includes(app.tier)) return false;
    // 3. Statuses
    if (filters.statuses.length > 0 && !filters.statuses.includes(app.status)) return false;
    // 4. Dates
    if (filters.dateFrom && new Date(app.created_at) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(app.created_at) > new Date(filters.dateTo)) return false;
    
    // 5. Loan Amount Range
    if (app.applied_amount < filters.amountRange[0] || app.applied_amount > filters.amountRange[1]) return false;

    // 6. Health Score Range (Requires assessment data)
    const assess = assessmentsMap[app.id];
    if (assess && assess.health_score !== null) {
      if (assess.health_score < filters.scoreRange[0] || assess.health_score > filters.scoreRange[1]) return false;
    } else if (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 1000) {
      // If filtering by score but no assessment exists, hide it
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-12 h-12 text-[#003366]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Loan Queue</h1>
          <p className="text-slate-500 mt-2">Review and assess pending MSME applications.</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={() => handleBulkExport('pdf')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4" /> Export PDF ({selectedIds.length})
              </button>
              <button
                onClick={() => handleBulkExport('csv')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                <Download className="w-4 h-4" /> Export CSV ({selectedIds.length})
              </button>
              {selectedIds.length === 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Compare Selected (2)
                </button>
              )}
            </>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" /> New Application
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Total Applications</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {applications.filter(a => a.status === "Processing").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Reviewed</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {applications.filter(a => a.status === "Reviewed").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Avg. Loan Amount</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            ₹{(applications.reduce((acc, a) => acc + a.applied_amount, 0) / (applications.length || 1) / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters 
        filters={filters}
        onFilterChange={setFilters}
        totalResults={filteredApplications.length}
      />

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleSelectAll}>
                  {selectedIds.length === filteredApplications.length && filteredApplications.length > 0
                    ? <CheckSquare className="w-4 h-4 text-[#003366]" />
                    : <Square className="w-4 h-4 text-slate-400" />}
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">PAN</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tier</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-slate-500 text-lg">No applications found.</p>
                    <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors">
                      <Plus className="w-4 h-4" /> Create First Application
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(app.id)}>
                      {selectedIds.includes(app.id)
                        ? <CheckSquare className="w-4 h-4 text-[#003366]" />
                        : <Square className="w-4 h-4 text-slate-400" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{app.business_name || "Unregistered MSME"}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{app.pan}</td>
                  <td className="px-6 py-4">{getTierBadge(app.tier)}</td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">₹{(app.applied_amount / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === "Reviewed" ? "bg-blue-100 text-blue-700" :
                      app.status === "Approved" ? "bg-green-100 text-green-700" :
                      app.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/application/${app.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors text-sm font-medium">
                      View Health Card <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">New Loan Application</h2>
              <p className="text-sm text-slate-500 mt-1">Enter MSME details. Tier is auto-detected.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number <span className="text-red-500">*</span></label>
                <input type="text" required value={formData.pan} onChange={(e) => setFormData({...formData, pan: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366]" placeholder="e.g., AABCS1234A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="text" value={formData.business_name} onChange={(e) => setFormData({...formData, business_name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366]" placeholder="e.g., Sharma Tea Stall" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="text" value={formData.gstin} onChange={(e) => setFormData({...formData, gstin: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366]" placeholder="Leave blank if unregistered" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount (₹)</label>
                <input type="number" required value={formData.applied_amount} onChange={(e) => setFormData({...formData, applied_amount: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366]" placeholder="e.g., 150000" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="tier3" checked={formData.simulate_zero_digital} onChange={(e) => setFormData({...formData, simulate_zero_digital: e.target.checked})} className="w-4 h-4 text-[#003366] rounded" />
                <label htmlFor="tier3" className="text-sm text-slate-600">Simulate Zero-Digital Footprint (Tier 3 Demo)</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080]">Initiate Data Fetch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Fetch Terminal */}
      {showFetchModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden border border-slate-700">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-mono font-bold text-green-400">Alternate Data Ingestion Pipeline</h2>
              {isFetching && <Loader2 className="w-4 h-4 animate-spin text-green-400 ml-auto" />}
            </div>
            <div className="p-6 font-mono text-sm text-green-300 h-80 overflow-y-auto space-y-2">
              {fetchLogs.map((log, i) => (
                <div key={i} className="flex gap-2 animate-pulse">
                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
              {isFetching && <span className="animate-pulse">_</span>}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && selectedIds.length === 2 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Side-by-Side Comparison</h2>
              <button onClick={() => setShowComparison(false)} className="text-slate-500 hover:text-slate-900">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {applications.filter(a => selectedIds.includes(a.id)).map((app) => (
                <div key={app.id} className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">{app.business_name || "Unregistered"}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">PAN:</span>
                      <span className="font-mono">{app.pan}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Loan Amount:</span>
                      <span className="font-bold">₹{(app.applied_amount / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Tier:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        app.tier === 'TIER_1' ? 'bg-green-100 text-green-700' :
                        app.tier === 'TIER_2' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'
                      }`}>{app.tier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span>{app.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">* Full score comparison requires both applications to have generated assessments.</p>
          </div>
        </div>
      )}
    </div>
  );
}