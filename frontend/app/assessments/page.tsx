"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Assessment } from "@/types";
import Link from "next/link";
import { Loader2, TrendingUp, Shield, CheckCircle } from "lucide-react";

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we'd have a dedicated endpoint for all assessments
        // For now, we'll use a mock approach
        const data: Assessment[] = [];
        setAssessments(data);
      } catch (err) {
        console.error("Failed to fetch assessments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-12 h-12 text-[#003366]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Portfolio Assessments</h1>
        <p className="text-slate-500 mt-2">Historical view of all generated Financial Health Cards.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Business</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Health Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Confidence</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Trust Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Generated</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                No assessments generated yet. Generate health cards from the Dashboard.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}