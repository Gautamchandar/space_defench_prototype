"use client";

import React, { useState } from "react";
import { RoadAssessmentItem, VerificationStatus, RiskLevel } from "@/types/disaster";
import { 
  Truck, 
  ShieldAlert, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Download, 
  ArrowUpDown,
  ExternalLink,
  MapPin,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface RoadAssessmentViewProps {
  roadItems: RoadAssessmentItem[];
  onSelectSegment: (segmentId: string) => void;
  onUpdateSegmentStatus: (segmentId: string, newStatus: VerificationStatus) => void;
}

export const RoadAssessmentView: React.FC<RoadAssessmentViewProps> = ({
  roadItems,
  onSelectSegment,
  onUpdateSegmentStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>("all");

  const filteredItems = roadItems.filter((item) => {
    // Status filter
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    // Risk filter
    if (selectedRiskFilter !== "all" && item.riskLevel !== selectedRiskFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.segmentId.toLowerCase().includes(q) ||
        item.roadName.toLowerCase().includes(q) ||
        item.locationKm.toLowerCase().includes(q) ||
        item.flagReason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "Needs Inspection":
        return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/40";
      case "Under Review":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40";
      case "Field Verified":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40";
      case "Insufficient Evidence":
        return "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/40";
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case "Critical":
        return "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60 border-red-200 dark:border-red-900";
      case "High":
        return "text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 border-orange-200 dark:border-orange-900";
      case "Medium":
        return "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900";
      case "Low":
        return "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900";
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Segment ID",
      "Road Name",
      "Location Marker",
      "Flag Reason",
      "Evidence Source",
      "Confidence (%)",
      "Verification Status",
      "Risk Level",
      "Length (Meters)",
      "Last Observation",
      "Action Required",
    ];

    const rows = filteredItems.map((item) => [
      `"${item.segmentId}"`,
      `"${item.roadName}"`,
      `"${item.locationKm}"`,
      `"${item.flagReason}"`,
      `"${item.evidenceSource}"`,
      item.confidence,
      `"${item.status}"`,
      `"${item.riskLevel}"`,
      item.lengthMeters,
      `"${item.lastObservation}"`,
      `"${item.recommendedAction}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `road_assessment_dharali_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Critical Life-Safety Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 via-white to-white dark:from-red-950/50 dark:via-navy-900 dark:to-navy-900 border border-red-300 dark:border-red-500/40 shadow-sm dark:shadow-xl transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-red-900 dark:text-red-200 tracking-wide uppercase font-mono">
                MANDATORY OPERATIONAL DIRECTIVE & SAFETY POLICY
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-200 dark:bg-red-500/30 text-red-800 dark:text-red-200 border border-red-400 font-semibold">
                LIFE CRITICAL
              </span>
            </div>
            <p className="text-xs text-red-800 dark:text-red-100/90 leading-relaxed font-medium">
              Satellite-based assessment does not confirm road passability. Field verification by Border Roads Organisation (BRO), State Disaster Response Force (SDRF), or local police checkpoints is required before clearing any route for vehicular transit.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md space-y-3 transition-colors">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search highway sector, milestone, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-navy-700 text-xs font-semibold transition-colors"
              title="Download CSV for field engineering units"
            >
              <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Export CSV Record</span>
            </button>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-navy-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono mr-1">STATUS:</span>
          {[
            { id: "all", label: "All Segments" },
            { id: "Needs Inspection", label: "Flagged for Inspection" },
            { id: "Under Review", label: "Analyst Reviewed" },
            { id: "Field Verified", label: "Field Verified" },
            { id: "Insufficient Evidence", label: "Insufficient Evidence" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                statusFilter === item.id
                  ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500 font-semibold"
                  : "bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-navy-800"
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 dark:bg-navy-700 mx-1 hidden sm:block" />

          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono mr-1">RISK:</span>
          {["all", "Critical", "High", "Medium"].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRiskFilter(risk)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                selectedRiskFilter === risk
                  ? "bg-slate-800 dark:bg-slate-700 text-white font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {risk.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-navy-850 border-b border-slate-200 dark:border-navy-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Segment ID</th>
                <th className="p-3.5">Road & Milestone</th>
                <th className="p-3.5">Hazard Flag Reason</th>
                <th className="p-3.5">Evidence Sensor</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Obs.</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-slate-500">
                    No road segments match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.segmentId}
                    className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors group cursor-pointer"
                    onClick={() => onSelectSegment(item.segmentId)}
                  >
                    {/* ID */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">
                          {item.segmentId}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono font-semibold ${getRiskBadge(item.riskLevel)}`}>
                          {item.riskLevel}
                        </span>
                      </div>
                    </td>

                    {/* Road Name */}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{item.roadName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                        {item.locationKm} ({item.lengthMeters}m sector)
                      </div>
                    </td>

                    {/* Flag Reason */}
                    <td className="p-3.5 max-w-xs">
                      <div className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {item.flagReason}
                      </div>
                    </td>

                    {/* Evidence */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] block">{item.evidenceSource}</span>
                    </td>

                    {/* Confidence */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-slate-200 dark:bg-navy-950 rounded-full overflow-hidden border border-slate-300 dark:border-navy-700">
                          <div
                            className={`h-full rounded-full ${
                              item.confidence > 85 ? "bg-emerald-500" : item.confidence > 70 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {item.confidence}%
                        </span>
                      </div>
                    </td>

                    {/* Verification Status */}
                    <td className="p-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateSegmentStatus(item.segmentId, e.target.value as VerificationStatus)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-medium bg-white dark:bg-navy-950 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500 ${getStatusBadge(item.status)}`}
                      >
                        <option value="Needs Inspection">Needs Inspection</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Field Verified">Field Verified</option>
                        <option value="Insufficient Evidence">Insufficient Evidence</option>
                      </select>
                    </td>

                    {/* Last Obs */}
                    <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {item.lastObservation.split(" ")[1]}
                    </td>

                    {/* Action */}
                    <td className="p-3.5 whitespace-nowrap text-right">
                      <button
                        onClick={() => onSelectSegment(item.segmentId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-navy-800 group-hover:bg-cyan-600 text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors text-[11px] font-medium"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-3.5 bg-slate-50 dark:bg-navy-850 border-t border-slate-200 dark:border-navy-700 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredItems.length}</strong> of{" "}
            <strong className="text-slate-800 dark:text-slate-200">{roadItems.length}</strong> highway corridor segments
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Critical Passability Risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> BRO Clearance In Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
