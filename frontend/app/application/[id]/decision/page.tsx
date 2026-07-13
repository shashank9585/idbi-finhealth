"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { ArrowLeft, CheckCircle2, Send, Zap, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store"; // Added Zustand store

export default function DecisionWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Zustand store for simulator toggles
  const { addEPFO, addUtility, setAddEPFO, setAddUtility } = useAppStore();

  const [recommendation, setRecommendation] = useState("proceed");
  const [notes, setNotes] = useState("Approve subject to fetching EPFO data and clarifying the ₹8L GST mismatch flagged in the Trust Matrix.");
  
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  let currentConfidence = 72;
  if (addEPFO) currentConfidence += 9;
  if (addUtility) currentConfidence += 8;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.submitDecision(parseInt(id), {
        recommendation,
        notes,
        final_confidence: currentConfidence
      });
      
      setShowSuccessModal(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error("Failed to submit decision", err);
      alert("Failed to submit decision. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/application/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Decision Workspace</h1>
          <p className="text-slate-500 text-sm">Simulate data additions, document your reasoning, and submit the final decision artifact.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: What-If Simulator */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" /> Confidence Simulator (What-If Analysis)
          </h3>
          <p className="text-sm text-slate-500 mb-6">Toggle available data sources to see how they impact the Assessment Confidence Score.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-medium text-slate-900">Add EPFO Payroll Data</p>
                <p className="text-xs text-slate-500">Verifies employee count and salary consistency.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={addEPFO} onChange={() => setAddEPFO(!addEPFO)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003366]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-medium text-slate-900">Add 6-Month Electricity Bills</p>
                <p className="text-xs text-slate-500">Verifies operational overheads and physical existence.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={addUtility} onChange={() => setAddUtility(!addUtility)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003366]"></div>
              </label>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-[#003366] to-[#004080] rounded-xl text-white flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">Projected Assessment Confidence</p>
              <p className="text-5xl font-bold mt-1">{currentConfidence}%</p>
            </div>
            <div className="text-right text-sm opacity-90">
              {currentConfidence >= 85 ? (
                <p className="flex items-center gap-2 font-bold"><CheckCircle2 className="w-5 h-5" /> High Confidence Threshold Met</p>
              ) : (
                <p>Below 85% threshold. Consider requesting more docs.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Final Decision */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Assessment Outcome</h3>
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recommendation</label>
              <select 
                value={recommendation} 
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003366] focus:border-[#003366]"
              >
                <option value="proceed">Proceed to Underwriting</option>
                <option value="info">Request More Information</option>
                <option value="reject">Reject Application</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Officer Notes & Conditions</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003366] focus:border-[#003366] resize-none"
              />
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} 
            {submitting ? "Submitting..." : "Submit Decision to LOS (via OCEN)"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Decision Submitted</h2>
            <p className="text-slate-500 text-sm mb-6">
              The decision artifact has been successfully packaged and sent to the Core Banking System via OCEN.
            </p>
            <p className="text-xs text-slate-400">Redirecting to Dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}