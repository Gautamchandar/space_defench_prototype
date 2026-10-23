"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Map, 
  GitCompare, 
  Truck, 
  FileText, 
  Database, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  AlertTriangle
} from "lucide-react";

export type NavTabId = 
  | "overview" 
  | "map" 
  | "change-detection" 
  | "road-assessment" 
  | "reports" 
  | "data-sources" 
  | "about";

interface SidebarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  flaggedRoadCount: number;
  debrisCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  flaggedRoadCount,
  debrisCount,
}) => {
  const navItems = [
    {
      id: "overview" as NavTabId,
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "map" as NavTabId,
      label: "Disaster Map",
      icon: Map,
      badge: `${debrisCount} Zones`,
      badgeColor: "bg-red-500/15 text-red-600 dark:text-red-300 border-red-500/30",
    },
    {
      id: "change-detection" as NavTabId,
      label: "Change Detection",
      icon: GitCompare,
      badge: "Optical+SAR",
      badgeColor: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    },
    {
      id: "road-assessment" as NavTabId,
      label: "Road Assessment",
      icon: Truck,
      badge: `${flaggedRoadCount} Flagged`,
      badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    },
    {
      id: "reports" as NavTabId,
      label: "Reports & Exports",
      icon: FileText,
      badge: "GeoJSON/CSV",
      badgeColor: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    },
    {
      id: "data-sources" as NavTabId,
      label: "Data Sources",
      icon: Database,
      badge: "4 Sensors",
      badgeColor: "bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600/30",
    },
    {
      id: "about" as NavTabId,
      label: "About Project",
      icon: Info,
      badge: "Roadmap",
      badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    },
  ];

  return (
    <aside
      className={`bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-navy-700/80 transition-all duration-300 flex flex-col justify-between shrink-0 z-30 select-none ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Top Nav items */}
      <div className="p-2 space-y-1">
        <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-slate-200 dark:border-navy-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          {!collapsed && <span>OPERATIONAL MODULES</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ml-auto"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-cyan-50 dark:bg-navy-800 text-cyan-700 dark:text-cyan-400 font-semibold border-l-4 border-cyan-600 dark:border-cyan-400 shadow-sm shadow-cyan-500/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-850 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-400"
                  }`}
                />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Mission Assurance pill */}
      {!collapsed ? (
        <div className="p-3 m-2 rounded-lg bg-amber-50 dark:bg-navy-950/80 border border-amber-200 dark:border-navy-800/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Verification Notice</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[10px] leading-relaxed">
            Satellite alerts do not guarantee route safety. Ground confirmation required before vehicle convoy transit.
          </p>
        </div>
      ) : (
        <div className="p-2 flex justify-center text-amber-600 dark:text-amber-400" title="Ground verification required">
          <Shield className="w-4 h-4" />
        </div>
      )}
    </aside>
  );
};
