"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { 
  DisasterFeature, 
  FeatureCategory, 
  VerificationStatus 
} from "@/types/disaster";
import { STUDY_AREA_META, RECENT_ACTIVITY_LOG } from "@/data/mockDisasterData";
import { useTheme } from "@/context/ThemeContext";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Compass, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Maximize2,
  TrendingDown,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from "recharts";

const InteractiveMap = dynamic(
  () => import("./InteractiveMap").then((m) => m.InteractiveMap),
  { ssr: false }
);

interface OverviewViewProps {
  features: DisasterFeature[];
  selectedFeatureId: string | null;
  onSelectFeature: (feature: DisasterFeature | null) => void;
  onNavigateTab: (tabId: "map" | "change-detection" | "road-assessment" | "reports" | "data-sources" | "about") => void;
  onFilterCategory?: (cat: FeatureCategory | "all") => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  features,
  selectedFeatureId,
  onSelectFeature,
  onNavigateTab,
}) => {
  const { theme } = useTheme();
  const [mapFilter, setMapFilter] = useState<FeatureCategory | "all">("all");

  // KPI Calculations
  const totalFeatures = features.length;
  const debrisZones = features.filter((f) => f.category === "debris_zone");
  const roadSegments = features.filter((f) => f.category === "road_segment");
  const infrastructureItems = features.filter((f) => f.category === "infrastructure");
  const verifiedCount = features.filter((f) => f.status === "Field Verified").length;
  const underReviewCount = features.filter((f) => f.status === "Under Review").length;
  const needsInspectionCount = features.filter((f) => f.status === "Needs Inspection").length;

  // Chart data for verification status
  const statusChartData = [
    { name: "Field Verified", count: verifiedCount, color: "#10b981" },
    { name: "Under Review", count: underReviewCount, color: "#f59e0b" },
    { name: "Needs Inspect", count: needsInspectionCount, color: "#ef4444" },
    { name: "Insufficient Ev.", count: features.filter(f => f.status === "Insufficient Evidence").length, color: "#64748b" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner Notice */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-900/60 shadow-sm dark:shadow-lg transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                OPERATIONAL SITUATION DASHBOARD — {STUDY_AREA_META.name.toUpperCase()}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-mono font-semibold">
                AOI GRID: UTK-44
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bhagirathi River Valley corridor post-cloudburst assessment. Sensor telemetry synthesized for emergency planning.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => onNavigateTab("map")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Full Screen Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div
          onClick={() => {
            setMapFilter("all");
            onNavigateTab("map");
          }}
          className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:bg-slate-50 dark:hover:bg-navy-850 transition-all shadow-sm dark:shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Area Assessed</span>
            <span className="text-[9px] font-mono bg-slate-100 dark:bg-navy-950 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800">DEMO</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mb-1">
            48.5 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">km²</span>
          </div>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1 font-medium">
            <span>Dharali–Harsil Basin</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => {
            setMapFilter("debris_zone");
            onNavigateTab("map");
          }}
          className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:border-red-400 dark:hover:border-red-500/60 hover:bg-slate-50 dark:hover:bg-navy-850 transition-all shadow-sm dark:shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-bl-full pointer-events-none group-hover:bg-red-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Debris Zones</span>
            <span className="text-[9px] font-mono bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 font-semibold">FLAGGED</span>
          </div>
          <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mb-1">
            {debrisZones.length} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">active scarps</span>
          </div>
          <div className="text-[11px] text-red-600 dark:text-red-300 flex items-center gap-1 font-medium">
            <span>Filter Landslides</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onNavigateTab("road-assessment")}
          className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:border-amber-400 dark:hover:border-amber-500/60 hover:bg-slate-50 dark:hover:bg-navy-850 transition-all shadow-sm dark:shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Road Corridors</span>
            <span className="text-[9px] font-mono bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-semibold">INSPECT</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mb-1">
            {roadSegments.length} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">flagged sectors</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-300 flex items-center gap-1 font-medium">
            <span>View Road Table</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => {
            setMapFilter("infrastructure");
            onNavigateTab("map");
          }}
          className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:border-purple-400 dark:hover:border-purple-500/60 hover:bg-slate-50 dark:hover:bg-navy-850 transition-all shadow-sm dark:shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Infrastructure Alerts</span>
            <span className="text-[9px] font-mono bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.5 rounded text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 font-semibold">ANOMALY</span>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-300 mb-1">
            {infrastructureItems.length} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">structures</span>
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-300 flex items-center gap-1 font-medium">
            <span>Bridges & Helipad</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 5 */}
        <div
          onClick={() => onNavigateTab("reports")}
          className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-navy-850 transition-all shadow-sm dark:shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Field Ground Truth</span>
            <span className="text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-semibold">SDRF/BRO</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mb-1">
            {verifiedCount} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {totalFeatures} verified</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-300 flex items-center gap-1 font-medium">
            <span>Export Situation Report</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Map & Intelligence Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Central Geospatial Map (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col h-[560px] rounded-xl overflow-hidden border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-sm dark:shadow-xl transition-colors">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-navy-850 border-b border-slate-200 dark:border-navy-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                Geospatial Tactical Map Preview
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Quick Filter:</span>
              <button
                onClick={() => setMapFilter("all")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  mapFilter === "all" ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMapFilter("debris_zone")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  mapFilter === "debris_zone" ? "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500/40 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Debris
              </button>
              <button
                onClick={() => setMapFilter("road_segment")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  mapFilter === "road_segment" ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Roads
              </button>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <InteractiveMap
              features={features}
              selectedFeatureId={selectedFeatureId}
              onSelectFeature={onSelectFeature}
              activeFilterCategory={mapFilter}
            />
          </div>
        </div>

        {/* Right Intelligence Column (1 Col) */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Recent Event Telemetry Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-700/80 pb-2 mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Triggering Monsoon Event
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-semibold">
                ACTIVE
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Trigger Mechanism:</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">High-Intensity Convective Cloudburst</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Precipitation Spike:</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-400 font-semibold">124mm in 3.5 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Impacted Basin:</span>
                <span className="text-slate-900 dark:text-slate-200">Bhagirathi Gorge / Kakora Gad</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Elevation Drop:</span>
                <span className="font-mono text-slate-900 dark:text-slate-200">3,400m &rarr; 2,620m AMSL</span>
              </div>
            </div>
          </div>

          {/* Verification Breakdown Mini Chart */}
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-700/80 pb-2 mb-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Ground Truth Pipeline
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {totalFeatures} Entities
              </span>
            </div>
            
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: theme === "dark" ? "#94a3b8" : "#475569", fontSize: 10 }} width={90} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: theme === "dark" ? "#0b1528" : "#ffffff", 
                      borderColor: theme === "dark" ? "#1b335a" : "#cbd5e1", 
                      color: theme === "dark" ? "#f1f5f9" : "#0f172a",
                      fontSize: "11px", 
                      borderRadius: "6px" 
                    }}
                    cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Log Feed */}
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md flex-1 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-700/80 pb-2 mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Recent Geospatial Log
              </h3>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 animate-pulse font-mono font-semibold">LIVE FEED</span>
            </div>

            <div className="space-y-3">
              {RECENT_ACTIVITY_LOG.map((act) => (
                <div key={act.id} className="text-xs space-y-0.5 border-l-2 border-slate-300 dark:border-navy-700 pl-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded border font-semibold ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{act.timestamp}</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{act.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{act.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
