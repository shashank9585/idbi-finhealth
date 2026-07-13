"use client";

import { useState } from "react";
import { Filter, Search, X, Calendar, TrendingUp } from "lucide-react";
import { FilterState } from "@/types";

interface AdvancedFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
}

export default function AdvancedFilters({ filters, onFilterChange, totalResults }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTier = (tier: string) => {
    const newTiers = filters.tiers.includes(tier)
      ? filters.tiers.filter(t => t !== tier)
      : [...filters.tiers, tier];
    onFilterChange({ ...filters, tiers: newTiers });
  };

  const toggleStatus = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: newStatuses });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      tiers: [],
      statuses: [],
      scoreRange: [0, 1000],
      dateFrom: "",
      dateTo: "",
    });
  };

  const activeFilterCount = 
    (filters.search ? 1 : 0) +
    filters.tiers.length +
    filters.statuses.length +
    (filters.dateFrom || filters.dateTo ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Main Filter Bar */}
      <div className="p-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Business Name, PAN, or GSTIN..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
          />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isExpanded || activeFilterCount > 0
              ? "bg-[#003366] text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Filter className="w-4 h-4" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <span className="bg-white text-[#003366] px-2 py-0.5 rounded-full text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Clear All
          </button>
        )}

        <div className="ml-auto text-sm text-slate-500">
          Showing <span className="font-bold text-slate-900">{totalResults}</span> applications
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-4">
          {/* Tier Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Business Tier
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "TIER_1", label: "Tier 1: Fully Digital", color: "bg-green-100 text-green-700 border-green-300" },
                { value: "TIER_2", label: "Tier 2: Semi-Digital", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
                { value: "TIER_3", label: "Tier 3: Zero-Digital", color: "bg-purple-100 text-purple-700 border-purple-300" },
              ].map(tier => (
                <button
                  key={tier.value}
                  onClick={() => toggleTier(tier.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    filters.tiers.includes(tier.value)
                      ? tier.color
                      : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Application Status
            </label>
            <div className="flex gap-2 flex-wrap">
              {["Processing", "Reviewed", "Approved", "Rejected", "Pending Info"].map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    filters.statuses.includes(status)
                      ? "bg-[#003366] text-white border-[#003366]"
                      : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date Range
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}