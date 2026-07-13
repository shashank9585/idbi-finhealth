"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";

const monthlyCashFlowData = [
  { month: 'Jul', inflow: 380, outflow: 290, net: 90 },
  { month: 'Aug', inflow: 410, outflow: 310, net: 100 },
  { month: 'Sep', inflow: 395, outflow: 305, net: 90 },
  { month: 'Oct', inflow: 425, outflow: 320, net: 105 },
  { month: 'Nov', inflow: 430, outflow: 315, net: 115 },
  { month: 'Dec', inflow: 450, outflow: 330, net: 120 },
  { month: 'Jan', inflow: 440, outflow: 325, net: 115 },
  { month: 'Feb', inflow: 460, outflow: 340, net: 120 },
  { month: 'Mar', inflow: 455, outflow: 335, net: 120 },
  { month: 'Apr', inflow: 470, outflow: 345, net: 125 },
  { month: 'May', inflow: 480, outflow: 350, net: 130 },
  { month: 'Jun', inflow: 490, outflow: 355, net: 135 },
];

export default function DimensionExplorerPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/application/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dimension Explorer: Cash Flow Health</h1>
          <p className="text-slate-500 text-sm">Deep dive into the financial stability and cash movement of the business.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">Cash Flow Health Score</p>
          <p className="text-5xl font-bold text-[#003366] mt-2">850 <span className="text-xl text-slate-400">/ 1000</span></p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <TrendingUp className="w-4 h-4" /> Improving Trend
          </span>
          <p className="text-xs text-slate-500 mt-2">Weight: 25% of Overall Health</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">12-Month Cash Flow Trend (in ₹ Thousands)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="inflow" fill="#10b981" name="Inflow" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" fill="#ef4444" name="Outflow" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="net" stroke="#003366" strokeWidth={2} name="Net Cash Flow" dot={{ r: 3 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-[#003366]" /> AI Reasoning & Evidence
        </h3>
        <div className="space-y-4 text-sm text-slate-600">
          <p><strong className="text-slate-900">Why this score?</strong> Cash flow is highly stable. The business has maintained a positive net operating cash flow for 12 consecutive months, averaging ₹1.2L per month. Inflows show a steady 8% month-over-month growth.</p>
          <p><strong className="text-slate-900">Evidence Used:</strong> 365 days of Account Aggregator bank statements, 18,254 UPI transactions, and verified GST inward supplies.</p>
          <p><strong className="text-slate-900">Areas for Improvement:</strong> While inflows are stable, there is a 15% volatility in outflows during March and April (likely due to yearly vendor settlements). This minor volatility prevented a perfect 1000 score.</p>
        </div>
      </div>
    </div>
  );
}