"use client";

import React, { useEffect, useRef, useState } from "react";
import type * as LeafletType from "leaflet";
import { 
  DisasterFeature, 
  FeatureCategory, 
  VerificationStatus,
  RiskLevel 
} from "@/types/disaster";
import { STUDY_AREA_META } from "@/data/mockDisasterData";
import { useTheme } from "@/context/ThemeContext";
import { 
  Layers, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Maximize2,
  Minimize2,
  ExternalLink,
  ShieldAlert,
  Info
} from "lucide-react";

interface InteractiveMapProps {
  features: DisasterFeature[];
  selectedFeatureId: string | null;
  onSelectFeature: (feature: DisasterFeature | null) => void;
  activeFilterCategory?: FeatureCategory | "all";
  initialFocusId?: string | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  features,
  selectedFeatureId,
  onSelectFeature,
  activeFilterCategory = "all",
  initialFocusId,
}) => {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((leafletModule) => {
        const Leaflet = leafletModule.default || leafletModule;
        // Fix default marker icon issues with bundlers
        delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
        Leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        setL(Leaflet);
        setLeafletLoaded(true);
      });
    }
  }, []);

  // Layer Visibility State
  const [visibleLayers, setVisibleLayers] = useState<Record<FeatureCategory, boolean>>({
    debris_zone: true,
    road_segment: true,
    infrastructure: true,
    river_channel: true,
    field_verification: true,
  });

  const [tileMode, setTileMode] = useState<"auto" | "dark" | "light" | "topo" | "satellite">("auto");
  const [showLegend, setShowLegend] = useState(true);

  const toggleLayer = (cat: FeatureCategory) => {
    setVisibleLayers((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Determine active effective tile mode
  const effectiveTileMode = tileMode === "auto" ? (theme === "dark" ? "dark" : "light") : tileMode;

  // Tile layer setup
  const getTileUrl = (mode: string) => {
    switch (mode) {
      case "dark":
        // CartoDB Dark Matter
        return {
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        };
      case "light":
        // CartoDB Positron
        return {
          url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        };
      case "topo":
        // OpenTopoMap
        return {
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
        };
      case "satellite":
      default:
        // Esri World Imagery
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !L) return;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const currentTile = getTileUrl(effectiveTileMode);
    const map = L.map(mapContainerRef.current, {
      center: STUDY_AREA_META.center,
      zoom: STUDY_AREA_META.defaultZoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(currentTile.url, {
      attribution: currentTile.attribution,
      maxZoom: 18,
      minZoom: 11,
    }).addTo(map);

    L.control.scale({ imperial: false, metric: true }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [leafletLoaded, L]);

  // Update base tile when tileMode or theme changes
  useEffect(() => {
    if (!L || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Find and remove current tile layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const currentTile = getTileUrl(effectiveTileMode);
    L.tileLayer(currentTile.url, {
      attribution: currentTile.attribution,
      maxZoom: 18,
      minZoom: 11,
    }).addTo(map);

    // Ensure layerGroup is still on top
    if (layersGroupRef.current) {
      layersGroupRef.current.eachLayer((layer: any) => {
        if (layer.bringToFront) layer.bringToFront();
      });
    }
  }, [effectiveTileMode, L]);

  // Re-draw features when visibility or features change
  useEffect(() => {
    if (!L || !mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    features.forEach((feature) => {
      // Check category visibility
      if (!visibleLayers[feature.category]) return;
      if (activeFilterCategory !== "all" && feature.category !== activeFilterCategory) return;

      const isSelected = selectedFeatureId === feature.id;

      // Color mapping
      let primaryColor = "#0284c7";
      let fillColor = "rgba(2, 132, 199, 0.25)";

      switch (feature.category) {
        case "debris_zone":
          primaryColor = isSelected ? "#dc2626" : "#ef4444";
          fillColor = isSelected ? "rgba(239, 68, 68, 0.45)" : "rgba(239, 68, 68, 0.28)";
          break;
        case "road_segment":
          primaryColor = feature.riskLevel === "Critical" ? "#ea580c" : "#f59e0b";
          fillColor = "rgba(245, 158, 11, 0.3)";
          break;
        case "river_channel":
          primaryColor = "#06b6d4";
          fillColor = "rgba(6, 182, 212, 0.35)";
          break;
        case "infrastructure":
          primaryColor = "#9333ea";
          fillColor = "rgba(147, 51, 234, 0.3)";
          break;
        case "field_verification":
          primaryColor = feature.status === "Field Verified" ? "#059669" : "#d97706";
          fillColor = "rgba(5, 150, 105, 0.3)";
          break;
      }

      // 1. Polygon rendering (for debris zones and river choke)
      if (feature.polygonCoords && feature.polygonCoords.length > 2) {
        const polygon = L.polygon(feature.polygonCoords, {
          color: primaryColor,
          weight: isSelected ? 4 : 2,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.6 : 0.4,
          dashArray: feature.status === "Under Review" ? "5, 5" : undefined,
        });

        polygon.on("click", () => {
          onSelectFeature(feature);
        });

        polygon.bindTooltip(
          `<strong>${feature.id}</strong><br/>${feature.name}<br/><span style="color:${primaryColor}">● ${feature.status} (${feature.confidence}%)</span>`,
          { sticky: true }
        );

        polygon.addTo(group);
      }

      // 2. Road line rendering
      if (feature.lineCoords && feature.lineCoords.length > 1) {
        const polyline = L.polyline(feature.lineCoords, {
          color: primaryColor,
          weight: isSelected ? 8 : 5,
          opacity: isSelected ? 1 : 0.85,
          dashArray: feature.status === "Needs Inspection" ? "8, 6" : undefined,
        });

        polyline.on("click", () => {
          onSelectFeature(feature);
        });

        polyline.bindTooltip(
          `<strong>${feature.id}</strong><br/>${feature.name}<br/><span style="color:#ea580c">⚠ ${feature.riskLevel} Risk</span>`,
          { sticky: true }
        );

        polyline.addTo(group);
      }

      // 3. Center marker / Point rendering
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? "28px" : "22px"};
            height: ${isSelected ? "28px" : "22px"};
            border-radius: 50%;
            background-color: ${primaryColor};
            border: 2px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px ${primaryColor};
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${theme === "dark" ? "#0b1528" : "#ffffff"};
            "></div>
            ${isSelected ? `
              <div style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                border: 2px solid ${primaryColor};
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            ` : ""}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(feature.coordinates, { icon: customIcon });

      marker.on("click", () => {
        onSelectFeature(feature);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <strong style="color: ${theme === "dark" ? "#00f0ff" : "#0284c7"}; font-family: monospace;">${feature.id}</strong>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(148, 163, 184, 0.2); font-weight: 600;">${feature.riskLevel}</span>
          </div>
          <div style="font-weight: 600; margin-bottom: 4px;">${feature.name}</div>
          <div style="font-size: 11px; margin-bottom: 6px; color: ${theme === "dark" ? "#94a3b8" : "#64748b"};">
            Status: <span style="color: #0284c7; font-weight: 600;">${feature.status}</span> • Confidence: <span style="color: #059669; font-weight: 600;">${feature.confidence}%</span>
          </div>
          <div style="font-size: 11px; border-top: 1px solid rgba(148, 163, 184, 0.2); padding-top: 4px;">
            ${feature.analystNotes.slice(0, 110)}...
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #d97706; font-style: italic;">
            DEMO DATA: Simulated spatial anomaly
          </div>
        </div>
      `);

      marker.addTo(group);
    });
  }, [features, visibleLayers, activeFilterCategory, selectedFeatureId, theme, L]);

  // Center on selected feature if changed
  useEffect(() => {
    if (!selectedFeatureId || !mapInstanceRef.current) return;
    const target = features.find((f) => f.id === selectedFeatureId);
    if (target) {
      mapInstanceRef.current.flyTo(target.coordinates, 15, {
        duration: 1.2,
      });
    }
  }, [selectedFeatureId, features]);

  // Handle initial focus
  useEffect(() => {
    if (!initialFocusId || !mapInstanceRef.current) return;
    const target = features.find((f) => f.id === initialFocusId);
    if (target) {
      mapInstanceRef.current.flyTo(target.coordinates, 15, {
        duration: 1.2,
      });
      onSelectFeature(target);
    }
  }, [initialFocusId]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(STUDY_AREA_META.center, STUDY_AREA_META.defaultZoom, {
        duration: 1.0,
      });
      onSelectFeature(null);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-navy-700/80 bg-slate-100 dark:bg-navy-950 shadow-xl transition-colors duration-200">
      {/* Top Map Action Toolbar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        {/* Reset View Button */}
        <button
          onClick={resetView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-navy-900/90 hover:bg-slate-50 dark:hover:bg-navy-800 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-navy-700 backdrop-blur-md shadow-md transition-all active:scale-95"
          title="Return camera to Dharali–Harsil study area"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Reset Study AOI</span>
        </button>

        {/* Base Tile Selector */}
        <div className="flex items-center rounded-lg bg-white/95 dark:bg-navy-900/90 border border-slate-200 dark:border-navy-700 p-0.5 backdrop-blur-md text-xs shadow-sm">
          <button
            onClick={() => setTileMode("auto")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              tileMode === "auto" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Auto ({theme === "dark" ? "Dark" : "Light"})
          </button>
          <button
            onClick={() => setTileMode(theme === "dark" ? "light" : "dark")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              tileMode === (theme === "dark" ? "light" : "dark") ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {theme === "dark" ? "Light GIS" : "Dark GIS"}
          </button>
          <button
            onClick={() => setTileMode("satellite")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              tileMode === "satellite" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setTileMode("topo")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              tileMode === "topo" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Topographic
          </button>
        </div>

        {/* Illustrative Disclaimer Tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-700 dark:text-amber-300 backdrop-blur-md">
          <ShieldAlert className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>DEMO OVERLAYS: Simulated Damage Locations</span>
        </div>
      </div>

      {/* Layer Visibility Control Panel (Top Right) */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end">
        <div className="bg-white/95 dark:bg-navy-900/90 border border-slate-200 dark:border-navy-700 backdrop-blur-md rounded-lg p-2.5 shadow-xl text-xs w-60">
          <div className="flex items-center justify-between font-mono text-[11px] text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-navy-700/80 pb-1.5 mb-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              LAYER TOGGLES
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
              {Object.values(visibleLayers).filter(Boolean).length}/5 ON
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Debris Zone */}
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500"></span>
                <span>Suspected Debris Zones</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.debris_zone}
                onChange={() => toggleLayer("debris_zone")}
                className="rounded border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
            </label>

            {/* Road Segments */}
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 rounded bg-amber-500"></span>
                <span>Flagged Road Corridors</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.road_segment}
                onChange={() => toggleLayer("road_segment")}
                className="rounded border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
            </label>

            {/* Infrastructure */}
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 border border-white"></span>
                <span>Bridges & Facilities</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.infrastructure}
                onChange={() => toggleLayer("infrastructure")}
                className="rounded border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
            </label>

            {/* River Channel */}
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-cyan-500/40 border border-cyan-500"></span>
                <span>River Silt Aggradation</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.river_channel}
                onChange={() => toggleLayer("river_channel")}
                className="rounded border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
            </label>

            {/* Field Verification */}
            <label className="flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
                <span>Field Teams (SDRF/BRO)</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.field_verification}
                onChange={() => toggleLayer("field_verification")}
                className="rounded border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Map Canvas Div */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-10" />

      {/* Bottom Compact Legend (Collapsible) */}
      {showLegend && (
        <div className="absolute bottom-6 left-3 z-[1000] bg-white/95 dark:bg-navy-900/90 border border-slate-200 dark:border-navy-700/80 rounded-lg p-2.5 backdrop-blur-md shadow-lg max-w-sm text-xs">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-700 pb-1 mb-1.5">
            <span className="text-slate-800 dark:text-slate-300 font-semibold">GEOSPATIAL LEGEND</span>
            <button
              onClick={() => setShowLegend(false)}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 text-slate-400 text-[10px]"
            >
              Hide
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-500/40 border border-red-500 shrink-0"></span>
              <span className="truncate">Active Debris Fan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-amber-500 shrink-0"></span>
              <span className="truncate">Blocked Highway (NH)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500/40 border border-cyan-500 shrink-0"></span>
              <span className="truncate">River Damming Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">Verified Ground Post</span>
            </div>
          </div>
        </div>
      )}

      {!showLegend && (
        <button
          onClick={() => setShowLegend(true)}
          className="absolute bottom-6 left-3 z-[1000] bg-white/90 dark:bg-navy-900/80 border border-slate-200 dark:border-navy-700 px-2 py-1 rounded text-[11px] text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 backdrop-blur-md shadow-sm"
        >
          Show Legend
        </button>
      )}
    </div>
  );
};
