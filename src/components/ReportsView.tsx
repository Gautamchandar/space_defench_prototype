"use client";

import React, { useState } from "react";
import { DisasterFeature, RoadAssessmentItem } from "@/types/disaster";
import { STUDY_AREA_META } from "@/data/mockDisasterData";
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  FileSpreadsheet, 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Compass, 
  FileCheck
} from "lucide-react";

interface ReportsViewProps {
  features: DisasterFeature[];
  roadItems: RoadAssessmentItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ features, roadItems }) => {
  const [reportType, setReportType] = useState<"executive" | "tactical" | "engineering">("executive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const reportId = "SITREP-UTK-2024-08-01";
  const generatedTime = new Date().toUTCString();

  // Export GeoJSON
  const handleExportGeoJSON = () => {
    const geojson = {
      type: "FeatureCollection",
      name: "Dharali_Harsil_Post_Landslide_Assessment_DEMO",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      metadata: {
        studyArea: STUDY_AREA_META.name,
        district: STUDY_AREA_META.district,
        state: STUDY_AREA_META.state,
        generatedAt: generatedTime,
        status: "DEMO DATA — ILLUSTRATIVE GEOSPATIAL ANOMALIES",
        disclaimer: "Not for operational vehicle routing or life-safety emergency deployment without ground verification.",
      },
      features: features.map((f) => ({
        type: "Feature",
        id: f.id,
        geometry: {
          type: f.polygonCoords ? "Polygon" : f.lineCoords ? "LineString" : "Point",
          coordinates: f.polygonCoords
            ? [f.polygonCoords.map(([lat, lng]) => [lng, lat])]
            : f.lineCoords
            ? f.lineCoords.map(([lat, lng]) => [lng, lat])
            : [f.coordinates[1], f.coordinates[0]],
        },
        properties: {
          id: f.id,
          name: f.name,
          category: f.category,
          status: f.status,
          confidence: f.confidence,
          riskLevel: f.riskLevel,
          areaSqM: f.areaSqM || null,
          lengthM: f.lengthM || null,
          observationDate: f.observationDate,
          analystNotes: f.analystNotes,
          recommendedAction: f.recommendedAction,
        },
      })),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `after_landslide_features_${new Date().toISOString().slice(0, 10)}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Feature ID",
      "Feature Name",
      "Category",
      "Verification Status",
      "Confidence (%)",
      "Risk Level",
      "Latitude",
      "Longitude",
      "Area (Sq M)",
      "Sensor Trace",
      "Analyst Notes",
      "Directive Action",
    ];

    const rows = features.map((f) => [
      `"${f.id}"`,
      `"${f.name}"`,
      `"${f.category}"`,
      `"${f.status}"`,
      f.confidence,
      `"${f.riskLevel}"`,
      f.coordinates[0],
      f.coordinates[1],
      f.areaSqM || 0,
      `"${f.evidenceDetails.sensor}"`,
      `"${f.analystNotes.replace(/"/g, '""')}"`,
      `"${f.recommendedAction.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `after_landslide_situation_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto print:p-0 print:m-0 print:max-w-none">
      {/* Top Controls Bar (Hidden in Print) */}
      <div className="print:hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide font-mono uppercase">
              POST-LANDSLIDE DISASTER SITUATION REPORTS & EXPORTS
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-mono font-semibold">
              OFFICIAL SITREP TEMPLATE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate printable situation briefs, machine-readable GeoJSON layers, and CSV field inspection manifests.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportGeoJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 border border-cyan-300 dark:border-cyan-500/30 text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Download GeoJSON for QGIS / ArcGIS / Cesium"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Download GeoJSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-750 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-navy-700 text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Download CSV for Excel / Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Download CSV Data</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="relative rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900/90 shadow-sm dark:shadow-2xl p-6 sm:p-10 space-y-6 text-slate-800 dark:text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none print:p-0 transition-colors">
        {/* Prominent DEMO Watermark in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 print:opacity-10">
          <span className="text-8xl sm:text-9xl font-black font-mono rotate-[-25deg] text-slate-400 dark:text-slate-500">
            DEMO DATA
          </span>
        </div>

        {/* Report Document Header */}
        <div className="border-b border-slate-200 dark:border-navy-700 print:border-black/20 pb-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400 print:text-blue-700">
                  {reportId}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 print:bg-amber-100 print:text-amber-800 border border-amber-300 dark:border-amber-500/40 font-mono font-bold">
                  SIMULATION DATASET
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white print:text-black tracking-tight">
                POST-LANDSLIDE SITUATIONAL ASSESSMENT REPORT
              </h1>
              <div className="text-xs text-slate-500 dark:text-slate-400 print:text-gray-600">
                Area of Interest: {STUDY_AREA_META.name}, {STUDY_AREA_META.district}, {STUDY_AREA_META.state}
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 dark:text-slate-400 print:text-gray-600 font-mono">
              <div>Generated: {generatedTime}</div>
              <div>Classification: RESTRICTED // DISASTER RESPONSE DEMO</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 print:text-blue-700 uppercase tracking-wider font-mono">
            1. EXECUTIVE SITUATIONAL SUMMARY
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 print:text-gray-800 leading-relaxed">
            Following torrential monsoon cloudburst activity in the upper Bhagirathi basin on 14 August 2024, AI-assisted bi-temporal change detection (Sentinel-2 MSI paired with Sentinel-1 C-SAR radar coherence) identified <strong>{features.filter(f => f.category === 'debris_zone').length} primary active landslide scarps</strong>, <strong>{roadItems.length} compromised highway segments on NH-134</strong>, and <strong>1 active river aggradation point</strong> causing backwater accumulation.
          </p>
        </div>

        {/* Key Metrics Summary Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:border print:border-gray-300 print:p-2">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 print:border-none print:bg-gray-50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500 uppercase block">Area Under Assessment</span>
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-white print:text-black">48.5 km²</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 print:border-none print:bg-gray-50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500 uppercase block">Flagged Debris Zones</span>
            <span className="font-mono text-lg font-bold text-red-600 dark:text-red-400 print:text-red-700">{features.filter(f => f.category === 'debris_zone').length} Scarps</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 print:border-none print:bg-gray-50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500 uppercase block">Blocked Highway Stretch</span>
            <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400 print:text-amber-700">~1,770 m total</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 print:border-none print:bg-gray-50">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-gray-500 uppercase block">Ground Verification</span>
            <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 print:text-emerald-700">
              {features.filter(f => f.status === 'Field Verified').length} / {features.length} Done
            </span>
          </div>
        </div>

        {/* Road Assessment Summary Table */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-cyan-700 dark:text-cyan-400 print:text-blue-700 uppercase tracking-wider font-mono">
            2. ROAD NETWORK & PASSABILITY STATUS (NH-134 CORRIDOR)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-navy-800 print:border-gray-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-navy-950 print:bg-gray-100 font-mono text-[10px] text-slate-600 dark:text-slate-400 print:text-gray-700 uppercase border-b border-slate-200 dark:border-navy-800 print:border-gray-300">
                <tr>
                  <th className="p-2.5">Segment ID</th>
                  <th className="p-2.5">Highway Milestone</th>
                  <th className="p-2.5">Observation Summary</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Directive Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800 print:divide-gray-200">
                {roadItems.map((rd) => (
                  <tr key={rd.segmentId}>
                    <td className="p-2.5 font-mono font-bold text-cyan-700 dark:text-cyan-400 print:text-blue-700 whitespace-nowrap">
                      {rd.segmentId}
                    </td>
                    <td className="p-2.5 text-slate-900 dark:text-slate-200 print:text-gray-900 whitespace-nowrap font-medium">
                      {rd.locationKm}
                    </td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300 print:text-gray-800">
                      {rd.flagReason}
                    </td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 print:border-gray-400 print:bg-white text-slate-800 dark:text-slate-200 print:text-gray-900">
                        {rd.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300 print:text-gray-800">
                      {rd.recommendedAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sensor & Analysis Data Limitations */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 print:bg-gray-50 print:border-gray-300 space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-slate-200 print:text-gray-900 font-mono text-[11px] uppercase tracking-wide flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 print:text-amber-600" />
            3. TECHNICAL SENSOR LIMITATIONS & STATUTORY DISCLAIMER
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 print:text-gray-700 text-[11px] leading-relaxed">
            <li>
              <strong>Cloud Shadow Occlusion:</strong> Optical Sentinel-2 imagery contains localized cirrus obscuration on the northern mountain ridgeline (above 3,600m). C-band radar was utilized as an all-weather backup.
            </li>
            <li>
              <strong>Mandatory Ground Verification:</strong> This report is intended strictly for rapid situational awareness and prioritization of field inspection assets. Satellite observations must never be used alone to certify road safety.
            </li>
            <li>
              <strong>Simulated Demonstration Data:</strong> Coordinates, damage boundaries, and confidence metrics are synthetic representations prepared for the Space and Defence Technology innovation demonstration.
            </li>
          </ul>
        </div>

        {/* Signatures & Certification Block */}
        <div className="pt-4 border-t border-slate-200 dark:border-navy-800 print:border-gray-300 grid grid-cols-2 gap-6 text-xs text-slate-500 dark:text-slate-400 print:text-gray-600 font-mono">
          <div>
            <div>Lead Geospatial Analyst:</div>
            <div className="text-slate-900 dark:text-white print:text-black font-semibold mt-1">Capt. R. Negi, BRO / SDRF Cell</div>
            <div className="text-[10px] text-slate-500">Digital Signature Verified • Sentinel Hub ID: #UTK-8821</div>
          </div>
          <div className="text-right">
            <div>Incident Response Center:</div>
            <div className="text-slate-900 dark:text-white print:text-black font-semibold mt-1">Emergency Operations Center (EOC), Uttarkashi</div>
            <div className="text-[10px] text-slate-500">Stamp: DEMO PROTOTYPE ONLY</div>
          </div>
        </div>
      </div>
    </div>
  );
};
