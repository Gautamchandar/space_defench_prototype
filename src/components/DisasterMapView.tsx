"use client";

import React, { useState } from "react";
import { DisasterFeature, FeatureCategory, VerificationStatus } from "@/types/disaster";
import { InteractiveMap } from "./InteractiveMap";
import { 
  Layers, 
  Filter, 
  Search, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Eye, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";

interface DisasterMapViewProps {
  features: DisasterFeature[];
  selectedFeatureId: string | null;
  onSelectFeature: (feature: DisasterFeature | null) => void;
  onUpdateStatus: (featureId: string, newStatus: VerificationStatus) => void;
}

export const DisasterMapView: React.FC<DisasterMapViewProps> = ({
  features,
  selectedFeatureId,
  onSelectFeature,
}) => {
  const [activeCategory, setActiveCategory] = useState<FeatureCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredFeatures = features.filter((f) => {
    if (activeCategory !== "all" && f.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.id.toLowerCase().includes(q) ||
        f.name.toLowerCase().includes(q) ||
        f.analystNotes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryBadge = (cat: FeatureCategory) => {
    switch (cat) {
      case "debris_zone":
        return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30";
      case "road_segment":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
      case "river_channel":
        return "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30";
      case "infrastructure":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
      case "field_verification":
        return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-62px)] flex flex-col overflow-hidden bg-slate-50 dark:bg-navy-950 transition-colors duration-200">
      {/* Top Map Context Ribbon */}
      <div className="px-4 py-2 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-700/80 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-navy-700 font-medium transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>{sidebarOpen ? "Hide Feature Drawer" : "Show Feature Drawer"}</span>
          </button>

          {/* Category Filter Pills */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { id: "all", label: "All Layers" },
              { id: "debris_zone", label: "Debris Zones" },
              { id: "road_segment", label: "Flagged Roads" },
              { id: "river_channel", label: "River Squeeze" },
              { id: "infrastructure", label: "Infrastructure" },
              { id: "field_verification", label: "Field Teams" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id as any)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeCategory === item.id
                    ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/50 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
            Showing <strong className="text-cyan-700 dark:text-cyan-400">{filteredFeatures.length}</strong> / {features.length} Geospatial Anomalies
          </div>
        </div>
      </div>

      {/* Main Map Body + Side Feature Drawer */}
      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* Interactive Map Core (Takes remaining width) */}
        <div className="flex-1 h-full w-full relative">
          <InteractiveMap
            features={features}
            selectedFeatureId={selectedFeatureId}
            onSelectFeature={onSelectFeature}
            activeFilterCategory={activeCategory}
          />
        </div>

        {/* Collapsible Feature Drawer (Right Side) */}
        {sidebarOpen && (
          <aside className="w-80 md:w-96 h-full bg-white dark:bg-navy-900 border-l border-slate-200 dark:border-navy-700/80 flex flex-col z-20 shadow-xl shrink-0 transition-colors duration-200">
            {/* Drawer Search & Filter */}
            <div className="p-3 border-b border-slate-200 dark:border-navy-750 bg-slate-50 dark:bg-navy-850 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter feature ID, debris, road..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Mobile Filter select */}
              <div className="lg:hidden flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Category:</span>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value as any)}
                  className="bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-700 text-slate-800 dark:text-slate-200 rounded px-2 py-1 text-xs"
                >
                  <option value="all">All Layers</option>
                  <option value="debris_zone">Debris Zones</option>
                  <option value="road_segment">Flagged Roads</option>
                  <option value="river_channel">River Squeeze</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="field_verification">Field Teams</option>
                </select>
              </div>
            </div>

            {/* Feature List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-navy-800 p-2 space-y-1.5">
              {filteredFeatures.length === 0 ? (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                  No features match your current filter.
                </div>
              ) : (
                filteredFeatures.map((feat) => {
                  const isSelected = selectedFeatureId === feat.id;
                  return (
                    <div
                      key={feat.id}
                      onClick={() => onSelectFeature(feat)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                        isSelected
                          ? "bg-cyan-50/70 dark:bg-navy-800 border-cyan-500 ring-1 ring-cyan-500 shadow-md shadow-cyan-500/10"
                          : "bg-slate-50/80 dark:bg-navy-950/60 border-slate-200 dark:border-navy-800 hover:border-slate-300 dark:hover:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-850/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400">
                            {feat.id}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${getCategoryBadge(feat.category)}`}>
                            {feat.category.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                          {feat.confidence}%
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors mb-1">
                        {feat.name}
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                        {feat.analystNotes}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 dark:border-navy-850 text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400">Status: <strong className="text-slate-800 dark:text-slate-300">{feat.status}</strong></span>
                        <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform font-medium">
                          Details &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
