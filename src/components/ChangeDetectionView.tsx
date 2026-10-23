"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  RotateCcw, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  ArrowRight, 
  ShieldAlert, 
  Maximize2,
  FileSpreadsheet,
  Info
} from "lucide-react";
import { DisasterFeature } from "@/types/disaster";

interface ChangeDetectionViewProps {
  features: DisasterFeature[];
  onSelectFeature: (feature: DisasterFeature) => void;
  onNavigateToMap: () => void;
}

export const ChangeDetectionView: React.FC<ChangeDetectionViewProps> = ({
  features,
  onSelectFeature,
  onNavigateToMap,
}) => {
  // Slider position (0 to 100%)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side">("slider");
  const [spectralMode, setSpectralMode] = useState<"rgb" | "false-color" | "elevation" | "heatmap">("rgb");
  const [overlayOpacity, setOverlayOpacity] = useState(75);

  // Analysis Pipeline state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    window.addEventListener("mousemove", handleMouseMove as any);
    window.addEventListener("touchmove", handleTouchMove as any);

    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
      window.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("touchmove", handleTouchMove as any);
    };
  }, [isDragging]);

  // Run Analysis Simulation Flow
  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setAnalysisComplete(false);

    const steps = [
      { step: 1, delay: 1000 },
      { step: 2, delay: 2000 },
      { step: 3, delay: 3200 },
      { step: 4, delay: 4500 },
      { step: 5, delay: 5800 },
      { step: 6, delay: 7000 },
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setAnalysisStep(step);
        if (step === 6) {
          setIsAnalyzing(false);
          setAnalysisComplete(true);
        }
      }, delay);
    });
  };

  const resetAnalysis = () => {
    setIsAnalyzing(false);
    setAnalysisStep(0);
    setAnalysisComplete(false);
  };

  const candidateFeatures = features.filter(
    (f) => f.category === "debris_zone" || f.category === "road_segment" || f.category === "river_channel"
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide font-mono uppercase">
              BI-TEMPORAL CHANGE DETECTION WORKSPACE
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-mono font-semibold">
              SENTINEL-2 MSI + DEM
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare baseline pre-event surface reflectance (08 Aug 2024) against post-landslide rapid ingest (15 Aug 2024).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isAnalyzing && !analysisComplete && (
            <button
              onClick={runAnalysis}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/20 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run Simulated Analysis</span>
            </button>
          )}

          {isAnalyzing && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-50 dark:bg-navy-800 border border-cyan-400 dark:border-cyan-500/50 text-cyan-800 dark:text-cyan-300 text-xs font-semibold animate-pulse">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-spin" />
              <span>Executing AI Differential Pipeline...</span>
            </div>
          )}

          {analysisComplete && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                DEMO ANALYSIS COMPLETE
              </span>
              <button
                onClick={resetAnalysis}
                className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-navy-700 transition-colors"
                title="Rerun analysis"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Interactive Imagery Viewer */}
        <div className="lg:col-span-3 space-y-3">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-xs shadow-sm transition-colors">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-950 p-1 rounded-lg border border-slate-200 dark:border-navy-800">
              <button
                onClick={() => setViewMode("slider")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === "slider" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Interactive Wipe Slider
              </button>
              <button
                onClick={() => setViewMode("side-by-side")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === "side-by-side" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Side-by-Side View
              </button>
            </div>

            {/* Spectral Filter Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-950 p-1 rounded-lg border border-slate-200 dark:border-navy-800">
              <button
                onClick={() => setSpectralMode("rgb")}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  spectralMode === "rgb" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                True Color RGB
              </button>
              <button
                onClick={() => setSpectralMode("false-color")}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  spectralMode === "false-color" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                False-Color NIR
              </button>
              <button
                onClick={() => setSpectralMode("elevation")}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  spectralMode === "elevation" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                DEM Slope Hillshade
              </button>
              <button
                onClick={() => setSpectralMode("heatmap")}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  spectralMode === "heatmap" ? "bg-red-500/15 text-red-700 dark:text-red-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Change Anomaly Mask
              </button>
            </div>

            {/* Overlay Opacity Slider */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Overlay Opacity:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-20 accent-cyan-600 dark:accent-cyan-400 h-1 bg-slate-200 dark:bg-navy-950 rounded cursor-pointer"
              />
              <span className="font-mono text-cyan-700 dark:text-cyan-400 text-[11px] w-8 font-semibold">{overlayOpacity}%</span>
            </div>
          </div>

          {/* Interactive Imagery Canvas / Display */}
          {viewMode === "slider" ? (
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-300 dark:border-navy-700 bg-slate-950 select-none cursor-ew-resize shadow-xl"
            >
              {/* After-Event Layer (Bottom Layer, visible on right side of slider) */}
              <div className="absolute inset-0 w-full h-full">
                <SatelliteSimCanvas
                  phase="after"
                  spectralMode={spectralMode}
                  overlayOpacity={overlayOpacity}
                  showChangeOverlay={analysisComplete || analysisStep >= 5}
                />
                <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-black/80 border border-red-500/50 text-red-400 text-xs font-mono font-semibold backdrop-blur-md">
                  POST-EVENT: 15 AUG 2024 (ACTIVE DEBRIS FLOW)
                </div>
              </div>

              {/* Before-Event Layer (Clipped to slider percentage) */}
              <div
                className="absolute inset-0 h-full overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <div style={{ width: containerRef.current?.clientWidth || "100%", height: "100%" }}>
                  <SatelliteSimCanvas
                    phase="before"
                    spectralMode={spectralMode}
                    overlayOpacity={overlayOpacity}
                    showChangeOverlay={false}
                  />
                </div>
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-black/80 border border-emerald-500/50 text-emerald-400 text-xs font-mono font-semibold backdrop-blur-md">
                  PRE-EVENT BASELINE: 08 AUG 2024 (INTACT SLOPES)
                </div>
              </div>

              {/* Draggable Divider Handle */}
              <div
                className="absolute top-0 bottom-0 z-20 w-1 bg-cyan-400 shadow-[0_0_15px_#00f0ff]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-xl cursor-ew-resize">
                  <Sliders className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Bottom Instructions */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/75 border border-slate-700 text-[11px] text-slate-200 backdrop-blur-md pointer-events-none">
                &larr; Drag slider to inspect before / after spectral surface changes &rarr;
              </div>
            </div>
          ) : (
            /* Side-by-Side View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[520px]">
              {/* Left: Pre-Event */}
              <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-navy-700 bg-slate-950 shadow-xl">
                <SatelliteSimCanvas
                  phase="before"
                  spectralMode={spectralMode}
                  overlayOpacity={overlayOpacity}
                  showChangeOverlay={false}
                />
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-emerald-500/50 text-emerald-400 text-[11px] font-mono font-semibold backdrop-blur-md">
                  PRE-EVENT: 08 AUG 2024
                </div>
              </div>

              {/* Right: Post-Event */}
              <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-navy-700 bg-slate-950 shadow-xl">
                <SatelliteSimCanvas
                  phase="after"
                  spectralMode={spectralMode}
                  overlayOpacity={overlayOpacity}
                  showChangeOverlay={analysisComplete || analysisStep >= 5}
                />
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-red-500/50 text-red-400 text-[11px] font-mono font-semibold backdrop-blur-md">
                  POST-EVENT: 15 AUG 2024
                </div>
              </div>
            </div>
          )}

          {/* Bottom Satellite Technical Disclaimer */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800 text-[11px] text-slate-600 dark:text-slate-400 shadow-sm transition-colors">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Simulation Notice:</strong> High-resolution satellite tiles and spectral differential layers are rendered for platform demonstration purposes. In Phase 2, direct connection to ESA Copernicus Sentinel Hub API and ISRO Bhuvan OGC services executes automated pixel tensor pipelines.
            </span>
          </div>
        </div>

        {/* Right 1 Col: Analysis Pipeline Steps & Candidate Results */}
        <div className="space-y-4">
          {/* Analysis Workflow Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-700 pb-2 mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                Automated Processing Workflow
              </h3>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-mono font-semibold">
                {isAnalyzing ? `Step ${analysisStep}/6` : analysisComplete ? "Completed" : "Idle"}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { step: 1, label: "Checking input imagery & SAR availability", desc: "Sentinel-2B pre & Sentinel-2A post ingested." },
                { step: 2, label: "Validating acquisition dates & cloud shadow", desc: "Cirrus cloud mask verified over Dharali gorge." },
                { step: 3, label: "Comparing bi-temporal spectral reflectance", desc: "NDVI drop differential > -0.42 computed." },
                { step: 4, label: "Generating candidate change polygons", desc: "3 major debris flows & 1 river choke detected." },
                { step: 5, label: "Preparing GIS vector overlays & buffers", desc: "NH-134 highway intersection flagged." },
                { step: 6, label: "Dispatching verification requests to SDRF/BRO", desc: "Analyst triage alerts populated in road module." },
              ].map((s) => {
                const isCurrent = analysisStep === s.step;
                const isDone = analysisStep > s.step || analysisComplete;

                return (
                  <div
                    key={s.step}
                    className={`p-2 rounded-lg border transition-all ${
                      isCurrent
                        ? "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-400 dark:border-cyan-400/80 shadow-sm"
                        : isDone
                        ? "bg-slate-50 dark:bg-navy-950 border-emerald-300 dark:border-emerald-500/30"
                        : "bg-slate-50/50 dark:bg-navy-950/40 border-slate-200 dark:border-navy-800 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`font-semibold text-[11px] ${isCurrent ? "text-cyan-800 dark:text-cyan-300" : isDone ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                        {s.step}. {s.label}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-spin shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-navy-700 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{s.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detected Candidate Anomalies List */}
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-700 pb-2 mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                Candidate Change Polygons
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500/40 font-semibold">
                {candidateFeatures.length} Entities
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {candidateFeatures.map((feat) => (
                <div
                  key={feat.id}
                  onClick={() => {
                    onSelectFeature(feat);
                    onNavigateToMap();
                  }}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-navy-850 cursor-pointer transition-all group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-400">{feat.id}</span>
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-semibold">
                      Conf: {feat.confidence}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                    {feat.name}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{feat.category.replace('_', ' ')}</span>
                    <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5 group-hover:underline font-medium">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Canvas-like Satellite Simulation Component
const SatelliteSimCanvas: React.FC<{
  phase: "before" | "after";
  spectralMode: "rgb" | "false-color" | "elevation" | "heatmap";
  overlayOpacity: number;
  showChangeOverlay: boolean;
}> = ({ phase, spectralMode, overlayOpacity, showChangeOverlay }) => {
  const isFalseColor = spectralMode === "false-color";
  const isElevation = spectralMode === "elevation";
  const isHeatmap = spectralMode === "heatmap";

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#07131e]">
      {/* Background Mountain Valley Topo Vector Render */}
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="slopeGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isFalseColor ? "#dc2626" : isElevation ? "#1e3a5f" : "#1b4d3e"} />
            <stop offset="100%" stopColor={isFalseColor ? "#991b1b" : isElevation ? "#0f172a" : "#0d2818"} />
          </linearGradient>

          <linearGradient id="riverBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={phase === "after" ? "#78716c" : "#0284c7"} />
            <stop offset="100%" stopColor={phase === "after" ? "#57534e" : "#0369a1"} />
          </linearGradient>

          <linearGradient id="debrisMud" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isHeatmap ? "#ff0000" : "#7c2d12"} />
            <stop offset="100%" stopColor={isHeatmap ? "#b91c1c" : "#451a03"} />
          </linearGradient>
        </defs>

        {/* Mountain background slopes */}
        <polygon points="0,0 1000,0 1000,320 600,240 0,280" fill="url(#slopeGreen)" opacity="0.9" />
        <polygon points="0,280 600,240 1000,320 1000,600 0,600" fill="url(#slopeGreen)" opacity="0.85" />

        {/* Contour lines (Elevation context) */}
        {isElevation && (
          <g stroke="#38bdf8" strokeWidth="1" opacity="0.3" fill="none">
            <path d="M0,100 Q400,120 1000,90" />
            <path d="M0,180 Q500,220 1000,160" />
            <path d="M0,260 Q450,290 1000,240" />
            <path d="M0,380 Q550,340 1000,400" />
            <path d="M0,480 Q600,460 1000,510" />
          </g>
        )}

        {/* Bhagirathi River Ribbon */}
        <path
          d="M0,330 C250,320 450,360 650,330 C800,310 920,340 1000,320 L1000,370 C920,390 800,360 650,380 C450,410 250,370 0,380 Z"
          fill="url(#riverBlue)"
        />

        {/* Gangotri National Highway (NH-134) */}
        <path
          d="M0,305 C250,295 450,335 650,305 C800,285 920,315 1000,295"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="6"
          strokeDasharray={phase === "after" ? "120 40 40 30" : undefined}
        />

        {/* Settlement Clusters (Dharali / Harsil) */}
        <rect x="220" y="270" width="45" height="25" fill="#475569" rx="2" />
        <rect x="280" y="275" width="35" height="20" fill="#475569" rx="2" />
        <rect x="720" y="255" width="55" height="30" fill="#475569" rx="2" />

        {/* If Phase is AFTER: render active landslide scarp, debris flow runout, and blocked road */}
        {phase === "after" && (
          <g opacity={overlayOpacity / 100}>
            {/* Upper scarp failure */}
            <polygon
              points="420,60 520,70 560,160 480,210 390,140"
              fill="url(#debrisMud)"
            />

            {/* Debris transport channel & fan over NH-134 highway and riverbank */}
            <polygon
              points="480,210 560,160 620,280 660,360 580,390 440,350 450,270"
              fill="url(#debrisMud)"
            />

            {/* Silt plume in river */}
            <path
              d="M580,360 C650,360 750,340 850,335 C950,330 1000,340 1000,360 L1000,370 C920,380 800,370 650,380 Z"
              fill="#a8a29e"
              opacity="0.85"
            />

            {/* Heatmap spectral anomaly bounding polygon */}
            {(showChangeOverlay || isHeatmap) && (
              <polygon
                points="410,50 570,60 680,360 590,410 430,360 380,140"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            )}
          </g>
        )}

        {/* Spatial Grid Coordinate Crosshairs */}
        <g stroke="#38bdf8" strokeWidth="0.5" opacity="0.4">
          <line x1="250" y1="20" x2="250" y2="580" strokeDasharray="3 6" />
          <line x1="500" y1="20" x2="500" y2="580" strokeDasharray="3 6" />
          <line x1="750" y1="20" x2="750" y2="580" strokeDasharray="3 6" />
          <line x1="20" y1="150" x2="980" y2="150" strokeDasharray="3 6" />
          <line x1="20" y1="300" x2="980" y2="300" strokeDasharray="3 6" />
          <line x1="20" y1="450" x2="980" y2="450" strokeDasharray="3 6" />
        </g>
      </svg>

      {/* Geospatial Coordinates HUD */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-cyan-400 bg-black/80 px-2 py-1 rounded border border-slate-700 pointer-events-none">
        31°02'04.2"N 78°44'16.8"E • EPSG:4326 • 10m/px
      </div>
    </div>
  );
};
