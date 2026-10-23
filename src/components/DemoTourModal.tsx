"use client";

import React from "react";
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  RotateCcw, 
  Sparkles, 
  MapPin, 
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Download,
  Info
} from "lucide-react";
import { NavTabId } from "./Sidebar";

export interface DemoStep {
  step: number;
  title: string;
  tab: NavTabId;
  targetFeatureId?: string;
  talkingPoints: string[];
  recommendedAction: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: "1. Himalayan Disaster Context & Challenge",
    tab: "about",
    talkingPoints: [
      "In Uttarakhand's steep Himalayan valleys, monsoon cloudbursts trigger sudden debris flows that sever strategic highway routes.",
      "Traditional response suffers from fragmented data, optical cloud cover, and delayed situational awareness.",
      "Our platform integrates satellite space assets (Optical + SAR) to generate actionable post-disaster situation maps in hours rather than days.",
    ],
    recommendedAction: "Orient judges with the problem statement and our Space & Defence innovation mandate.",
  },
  {
    step: 2,
    title: "2. Study Area: Dharali–Harsil Corridor",
    tab: "overview",
    talkingPoints: [
      "Target Area of Interest: Dharali–Harsil sector along the Gangotri National Highway (NH-134, Uttarkashi).",
      "Elevation spans 2,480m to 3,850m AMSL, where Kakora Gad debris fans intersect the Bhagirathi river gorge.",
      "The command overview dashboard synthesizes 48.5 km² of assessment area with real-time KPI metrics (clearly marked DEMO DATA).",
    ],
    recommendedAction: "Examine the 5 KPI summary cards and the live recent activity feed.",
  },
  {
    step: 3,
    title: "3. Interactive Geospatial Disaster Map",
    tab: "map",
    talkingPoints: [
      "High-performance interactive mapping powered by Leaflet with dark tactical or light cartography.",
      "Geospatial vector overlays include suspected landslide scarps, road sectors, bridges, river aggradation, and SDRF field camps.",
      "Every map feature is clickable with complete provenance: sensor trace, confidence scores, and analyst directives.",
    ],
    recommendedAction: "Showcase the interactive pan, zoom, layer controls, and dark/satellite basemap switcher.",
  },
  {
    step: 4,
    title: "4. Toggle Illustrative Debris Layer & Inspect",
    tab: "map",
    targetFeatureId: "LS-UTK-2024-001",
    talkingPoints: [
      "Click feature 'LS-UTK-2024-001' (Kakora Gad Active Debris Fan).",
      "Notice the calculated 14.2-hectare active runout polygon originating at 3,400m elevation with an estimated 310,000 m³ debris volume.",
      "Analyst directives recommend immediate heavy earthmover deployment from the Border Roads Organisation (BRO).",
    ],
    recommendedAction: "Open the feature detail modal to view full sensor metadata and copy GeoJSON snippet.",
  },
  {
    step: 5,
    title: "5. Bi-Temporal Change Detection Workspace",
    tab: "change-detection",
    talkingPoints: [
      "Side-by-side and interactive wipe slider comparing pre-event baseline (08 Aug 2024) against post-disaster rapid ingest (15 Aug 2024).",
      "Multi-spectral toggles: True-color RGB, False-color Near-Infrared (vegetation loss in red), and DEM slope hillshade.",
      "Enables analysts to visually trace landslide scarps and sediment aggradation across the Bhagirathi river channel.",
    ],
    recommendedAction: "Drag the before/after slider across the valley floor to observe the debris fan impact.",
  },
  {
    step: 6,
    title: "6. Execute Simulated AI Analysis Pipeline",
    tab: "change-detection",
    talkingPoints: [
      "Click 'Run Simulated Analysis' to trigger our 6-step automated processing pipeline.",
      "Simulates radiometric calibration, cloud masking, bi-temporal NDVI differencing, vector polygon generation, and alert routing.",
      "Concludes with an honest 'DEMO ANALYSIS COMPLETE' certification, acknowledging browser client limits versus backend HPC.",
    ],
    recommendedAction: "Click 'Run Simulated Analysis' button and watch the live step progress animation.",
  },
  {
    step: 7,
    title: "7. Review Flagged Road Corridor (NH-134)",
    tab: "road-assessment",
    talkingPoints: [
      "Navigate to the Road Access Assessment table.",
      "Segment RD-SEG-101 (NH-134 km 48+200) is flagged Critical: 140m road section buried under heavy granite boulders.",
      "Interactive status triage allows command officers to transition segments from 'Needs Inspection' to 'Under Review' or 'Field Verified'.",
    ],
    recommendedAction: "Filter by 'Flagged for Inspection' and inspect segment RD-SEG-101.",
  },
  {
    step: 8,
    title: "8. Mandatory Ground Truth Verification Policy",
    tab: "road-assessment",
    talkingPoints: [
      "Crucial life-safety doctrine: Satellite imagery alone can NEVER certify a road as safe for civilian convoys.",
      "Prominently displayed banner: 'Satellite-based assessment does not confirm road passability. Field verification is required.'",
      "Integrates with in-situ radio reports from SDRF Alpha Patrol and BRO Mile 49 engineering teams.",
    ],
    recommendedAction: "Highlight the safety directive to demonstrate operational realism for defense applications.",
  },
  {
    step: 9,
    title: "9. Generate Official SITREP & Export Data",
    tab: "reports",
    talkingPoints: [
      "Generate official Post-Landslide Situational Assessment Report (SITREP-UTK-2024-08-01).",
      "Complete with executive summary, damaged corridor table, sensor limitations, and clear DEMO DATA watermarks.",
      "Direct 1-click downloads for machine-readable GeoJSON layers and CSV manifests for tactical field teams.",
    ],
    recommendedAction: "Click 'Print / Save PDF' or test downloading the real GeoJSON file.",
  },
];

interface DemoTourModalProps {
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCloseDemo: () => void;
  onResetDemo: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onCloseDemo,
  onResetDemo,
}) => {
  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === DEMO_STEPS.length - 1;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[500px] z-[3000] bg-white/95 dark:bg-navy-900/95 border-2 border-cyan-600/80 dark:border-cyan-500/80 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-md text-slate-800 dark:text-slate-100 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-200 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-700/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 block leading-tight">
              EVALUATOR GUIDED DEMO ({currentStepIndex + 1} / {DEMO_STEPS.length})
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono leading-tight">
              {currentStep.title}
            </h4>
          </div>
        </div>

        <button
          onClick={onCloseDemo}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title="Exit demo tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Presenter Talking Points */}
      <div className="space-y-2 text-xs">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
          Presenter Briefing Points:
        </span>
        <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
          {currentStep.talkingPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Evaluator Action */}
      <div className="p-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 text-xs">
        <span className="font-semibold text-cyan-900 dark:text-cyan-300 block text-[11px] mb-0.5">
          Suggested Interactive Action:
        </span>
        <p className="text-cyan-950 dark:text-cyan-100/90 text-[11px] leading-tight">
          {currentStep.recommendedAction}
        </p>
      </div>

      {/* Progress Dots & Navigation Footer */}
      <div className="pt-2 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs">
        {/* Step dots */}
        <div className="flex items-center gap-1">
          {DEMO_STEPS.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStepIndex
                  ? "bg-cyan-600 dark:bg-cyan-400 w-5"
                  : i < currentStepIndex
                  ? "bg-emerald-500 dark:bg-emerald-400"
                  : "bg-slate-300 dark:bg-navy-700"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={onPrevStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 transition-colors text-xs font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {!isLast ? (
            <button
              onClick={onNextStep}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-900/20 transition-colors text-xs"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onCloseDemo}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-900/20 transition-colors text-xs"
            >
              <span>Finish Demo</span>
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
