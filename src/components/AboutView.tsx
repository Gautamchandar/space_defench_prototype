"use client";

import React from "react";
import { 
  Satellite, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Compass, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  FileCode,
  Milestone,
  AlertTriangle,
  Lightbulb
} from "lucide-react";

export const AboutView: React.FC = () => {
  const roadmapSteps = [
    {
      phase: "Phase 1",
      title: "Interactive Mapping & Intelligence Prototype",
      status: "COMPLETED",
      statusColor: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40",
      description: "Interactive geospatial command dashboard, bi-temporal change detection workspace, road triage table, GeoJSON/CSV exports, and guided evaluator demo mode.",
    },
    {
      phase: "Phase 2",
      title: "Automated Satellite Ingestion Pipeline",
      status: "IN PROGRESS",
      statusColor: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40",
      description: "Direct API integration with ESA Copernicus Sentinel Data Space (STAC API) and ISRO Bhuvan OGC web services. Automated cloud masking and Sen2Cor surface reflectance.",
    },
    {
      phase: "Phase 3",
      title: "Validated Geospatial AI Change Models",
      status: "PLANNED",
      statusColor: "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/40",
      description: "Deep learning segmentation (Siamese U-Net / ChangeFormer) combining optical spectral differences with Sentinel-1 SAR interferometric coherence (InSAR) for cloud penetration.",
    },
    {
      phase: "Phase 4",
      title: "Tactical Field Report & Offline Sync",
      status: "PLANNED",
      statusColor: "bg-slate-200 dark:bg-slate-700/50 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600/40",
      description: "Ruggedized mobile app for BRO (Border Roads Organisation) road crews and SDRF search-and-rescue teams. Sub-GHz radio packet broadcast and offline vector sync.",
    },
    {
      phase: "Phase 5",
      title: "Operational Defence & Civil Protection Pilot",
      status: "VISION",
      statusColor: "bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40",
      description: "Institutional deployment with Uttarakhand State Disaster Management Authority (USDMA), National Disaster Response Force (NDRF), and military mountain corridors.",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-[1400px] mx-auto">
      {/* Hero Mission Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white via-cyan-50/40 to-slate-50 dark:from-navy-900 dark:via-navy-850 dark:to-navy-950 border border-cyan-200 dark:border-cyan-900/60 shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-xs font-mono font-semibold">
            <Satellite className="w-3.5 h-3.5" />
            <span>SPACE & DEFENCE TECHNOLOGY INNOVATION PROJECT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            AFTER THE LANDSLIDE
          </h1>
          <p className="text-lg text-cyan-800 dark:text-cyan-200/90 font-medium leading-relaxed">
            From Satellite Intelligence to Faster Disaster Response.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            In the remote Himalayan terrain of Uttarakhand, India, sudden cloudbursts and landslides trigger catastrophic debris flows that sever strategic highway arteries, isolate mountain communities, and breach river channels. <strong>After The Landslide</strong> provides an AI-augmented decision support environment for commanders, emergency engineers, and relief planners.
          </p>
        </div>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="p-6 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md space-y-4 transition-colors">
          <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-mono text-sm font-bold uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>The Crisis & Operational Challenge</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Following a major Himalayan landslide, disaster response authorities face critical operational blind spots:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span><strong>Impassable Corridors:</strong> Blocked roads and collapsed bridges trap pilgrims and civilians, preventing rescue convoys from reaching disaster ground zero.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span><strong>Monsoon Cloud Occlusion:</strong> Heavy cloud cover blinds conventional optical satellites, delaying situational awareness for days.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span><strong>Fragmented Coordination:</strong> SDRF teams, BRO engineers, and district magistrates work with mismatched map printouts and outdated GIS shapes.</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="p-6 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md space-y-4 transition-colors">
          <div className="flex items-center gap-2.5 text-cyan-700 dark:text-cyan-400 font-mono text-sm font-bold uppercase tracking-wider">
            <Lightbulb className="w-5 h-5 shrink-0" />
            <span>The Satellite Intelligence Solution</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A unified post-disaster situational intelligence platform integrating multi-sensor space assets with ground truth:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Multi-Modal Space Fusion:</strong> Combines optical Sentinel-2 / Cartosat multispectral imagery with all-weather C-band radar (SAR) to penetrate clouds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Automated Change Detection:</strong> Evaluates spectral anomalies, NDVI loss, and DEM slope differentials to flag active debris scarps in minutes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 mt-1.5 shrink-0" />
              <span><strong>Human-in-the-Loop Triage:</strong> Empowers analysts to review, refine, and dispatch actionable inspection directives to field teams.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Expected Value & Impact */}
      <div className="p-6 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md transition-colors">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Quantifiable Mission Impact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-1">
            <div className="text-lg font-bold font-mono text-cyan-700 dark:text-cyan-400">70% Faster</div>
            <div className="font-semibold text-slate-900 dark:text-slate-200">Situational Awareness</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Automated ingestion eliminates hours of manual satellite image search across disjointed portals.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-1">
            <div className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">Precision Triage</div>
            <div className="font-semibold text-slate-900 dark:text-slate-200">Asset Prioritization</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">BRO heavy bulldozers dispatched straight to critical road choke points rather than blind patrol scouting.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-1">
            <div className="text-lg font-bold font-mono text-amber-700 dark:text-amber-400">Interoperable</div>
            <div className="font-semibold text-slate-900 dark:text-slate-200">Standard GeoJSON / CSV</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant export into defense mapping software, national disaster databases, and tactical field tablets.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-1">
            <div className="text-lg font-bold font-mono text-purple-700 dark:text-purple-400">Repeatable</div>
            <div className="font-semibold text-slate-900 dark:text-slate-200">Standardized Workflow</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Consistent multi-criteria scoring algorithm adaptable to any Himalayan basin or Western Ghats corridor.</p>
          </div>
        </div>
      </div>

      {/* Development Roadmap */}
      <div className="p-6 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Milestone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Project Development & Technology Roadmap
          </h3>
          <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-semibold">5-Phase Evolution Plan</span>
        </div>

        <div className="space-y-4 pt-2">
          {roadmapSteps.map((step) => (
            <div
              key={step.phase}
              className="p-4 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400">{step.phase}:</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{step.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>

              <div className="shrink-0">
                <span className={`text-[10px] px-2.5 py-1 rounded font-mono font-bold border ${step.statusColor}`}>
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Regulatory & Legal Notice */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3 transition-colors">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-800 dark:text-slate-300 block">
            Advisory Support System Disclaimer:
          </span>
          <p className="text-[11px] leading-relaxed">
            This platform is an operational prototype built for the Space and Defence Technology innovation initiative. It is engineered to assist authorized decision-makers, disaster response cells, and emergency command officers. It does not replace field geotechnical inspection, official meteorological forecasts, or immediate emergency dispatch authorities.
          </p>
        </div>
      </div>
    </div>
  );
};
