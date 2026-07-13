"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, FileText, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store"; // Added Zustand store

export default function EvidenceCenterPage() {
  const params = useParams();
  const id = params.id as string;

  // Zustand store to read simulator toggles
  const { addEPFO, addUtility } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/application/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Evidence & Verification Center</h1>
          <p className="text-slate-500 text-sm">Audit log of all fetched data, cross-verification checks, and detected anomalies.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#003366]" />
          <h3 className="text-lg font-bold text-slate-900">Cross-Verification Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Metric</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">GST Reported (ULI)</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Bank Credits (AA)</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Delta</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">Annual Revenue</td>
                <td className="px-6 py-4 text-slate-600">₹50,00,000</td>
                <td className="px-6 py-4 text-slate-600">₹48,50,000</td>
                <td className="px-6 py-4 text-slate-600">3.0%</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 bg-red-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">Top Customer (ABC Textiles)</td>
                <td className="px-6 py-4 text-slate-600">₹12,00,000</td>
                <td className="px-6 py-4 text-slate-600">₹4,00,000</td>
                <td className="px-6 py-4 text-red-600 font-bold">66.6%</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <XCircle className="w-3 h-3" /> High Mismatch
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">Supplier Payments</td>
                <td className="px-6 py-4 text-slate-600">₹28,00,000</td>
                <td className="px-6 py-4 text-slate-600">₹27,50,000</td>
                <td className="px-6 py-4 text-slate-600">1.8%</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#003366]" /> Data Coverage
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
              <span className="text-sm font-medium text-slate-900">GST Returns (24 Months)</span>
              <span className="text-xs text-green-700 font-medium">Fetched Yesterday</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
              <span className="text-sm font-medium text-slate-900">Bank Statements (AA)</span>
              <span className="text-xs text-green-700 font-medium">Fetched Today</span>
            </div>
            
            {/* Dynamic EPFO Row */}
            <div className={`flex justify-between items-center p-3 rounded-lg border ${addEPFO ? 'bg-green-50 border-green-100' : 'bg-green-50 border-green-100'}`}>
              <span className="text-sm font-medium text-slate-900">EPFO Payroll</span>
              <span className={`text-xs font-medium ${addEPFO ? 'text-green-700' : 'text-green-700'}`}>
                {addEPFO ? 'Verified (Just Now)' : 'Fetched 2 Days Ago'}
              </span>
            </div>
            
            {/* Dynamic Utility Bills Row */}
            <div className={`flex justify-between items-center p-3 rounded-lg border ${addUtility ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <span className="text-sm font-medium text-slate-900">Utility Bills (Electricity)</span>
              <span className={`text-xs font-medium ${addUtility ? 'text-green-700' : 'text-red-700'}`}>
                {addUtility ? 'Verified (Just Now)' : 'Missing'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" /> ML Anomaly Flags
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-sm font-bold text-yellow-800">Round-trip funding detected</p>
              <p className="text-xs text-yellow-700 mt-1">₹2,00,000 debited to 'ABC Traders' and credited back from 'XYZ Enterprises' within 24 hours on May 12th.</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-sm font-bold text-yellow-800">Cash deposit concentration</p>
              <p className="text-xs text-yellow-700 mt-1">40% of monthly cash deposits occurred in the last 5 days of the month. Verify if this is regular pattern.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}