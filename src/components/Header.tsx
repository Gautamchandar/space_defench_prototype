"use client";

import React from "react";
import { 
  Satellite, 
  MapPin, 
  Clock, 
  Radio, 
  PlayCircle, 
  RotateCcw, 
  ShieldAlert, 
  User, 
  Layers,
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { STUDY_AREA_META } from "@/data/mockDisasterData";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onStartDemo: () => void;
  onResetDemo: () => void;
  isDemoRunning: boolean;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  onStartDemo,
  onResetDemo,
  isDemoRunning,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-700/80 sticky top-0 z-40 px-4 py-2.5 shadow-sm dark:shadow-lg dark:shadow-black/40 transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between gap-y-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-50 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-600/30 border border-cyan-400/50 dark:border-cyan-500/40 shadow-inner">
            <Satellite className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                DEFENCE & DISASTER TECH PROTOTYPE
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                DEMO MODE
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                AFTER THE LANDSLIDE
              </h1>
              <span className="hidden md:inline text-xs text-slate-500 dark:text-slate-400">
                — From Satellite Intelligence to Faster Disaster Response
              </span>
            </div>
          </div>
        </div>

        {/* Study Area & Telemetry Context Bar */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs">
          {/* Study Area */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-none">AOI / Study Area</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">{STUDY_AREA_META.name}</span>
            </div>
          </div>

          {/* Event Date */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-none">Incident Window</span>
              <span className="font-medium text-slate-900 dark:text-slate-200">14–15 Aug 2024 (Active Surge)</span>
            </div>
          </div>

          {/* Data Freshness Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-none">Data Ingest Freshness</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{STUDY_AREA_META.lastDataFreshness}</span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400 transition-all shadow-sm"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Demo Controls */}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={onStartDemo}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 shadow-sm ${
                isDemoRunning 
                  ? "bg-cyan-600 dark:bg-cyan-500 text-white dark:text-navy-950 ring-2 ring-cyan-400 shadow-cyan-500/30" 
                  : "bg-cyan-600/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/20 dark:hover:bg-cyan-500/30 hover:border-cyan-500"
              }`}
              title="Launch guided presentation demo flow for evaluators"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{isDemoRunning ? "Demo Active" : "Start Demo"}</span>
            </button>

            <button
              onClick={onResetDemo}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-navy-700 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
              title="Reset application filters, demo state, and markers"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-navy-700">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-navy-800 border border-slate-300 dark:border-navy-600 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 block">Capt. R. Negi</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">BRO / SDRF Cell</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
