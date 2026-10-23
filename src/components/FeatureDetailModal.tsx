"use client";

import React, { useState } from "react";
import { DisasterFeature, VerificationStatus } from "@/types/disaster";
import { 
  X, 
  MapPin, 
  Calendar, 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  Activity, 
  ExternalLink,
  Edit3,
  Copy,
  Check,
  Navigation
} from "lucide-react";

interface FeatureDetailModalProps {
  feature: DisasterFeature | null;
  onClose: () => void;
  onUpdateStatus: (featureId: string, newStatus: VerificationStatus) => void;
  onSaveNote: (featureId: string, newNote: string) => void;
  onFocusMap?: (feature: DisasterFeature) => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  feature,
  onClose,
  onUpdateStatus,
  onSaveNote,
  onFocusMap,
}) => {
  if (!feature) return null;

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(feature.analystNotes);
  const [copied, setCopied] = useState(false);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "Field Verified":
        return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40 font-semibold";
      case "Under Review":
        return "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-500/40 font-semibold";
      case "Needs Inspection":
        return "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 border-red-300 dark:border-red-500/40 font-semibold";
      case "Insufficient Evidence":
        return "bg-slate-100 dark:bg-slate-500/20 text-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-500/40 font-semibold";
    }
  };

  const copyGeoJSON = () => {
    const geojson = {
      type: "Feature",
      geometry: {
        type: feature.polygonCoords ? "Polygon" : feature.lineCoords ? "LineString" : "Point",
        coordinates: feature.polygonCoords 
          ? [feature.polygonCoords.map(([lat, lng]) => [lng, lat])]
          : feature.lineCoords 
            ? feature.lineCoords.map(([lat, lng]) => [lng, lat])
            : [feature.coordinates[1], feature.coordinates[0]],
      },
      properties: {
        id: feature.id,
        name: feature.name,
        category: feature.category,
        status: feature.status,
        confidence: feature.confidence,
        riskLevel: feature.riskLevel,
        analystNotes: feature.analystNotes,
        isSimulatedDemoData: true,
      },
    };

    navigator.clipboard.writeText(JSON.stringify(geojson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    onSaveNote(feature.id, noteText);
    setIsEditingNote(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-navy-700/80 bg-slate-50 dark:bg-navy-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400 px-2 py-1 bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-800 rounded">
              {feature.id}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusBadge(feature.status)}`}>
              {feature.status}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-mono font-semibold">
              Conf: {feature.confidence}%
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{feature.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                {feature.coordinates[0].toFixed(4)}°N, {feature.coordinates[1].toFixed(4)}°E
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Observed: {feature.observationDate}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                Risk: {feature.riskLevel}
              </span>
            </div>
          </div>

          {/* Metric Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Feature Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                {feature.category.replace('_', ' ')}
              </span>
            </div>
            {feature.areaSqM && (
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Estimated Area</span>
                <span className="font-mono font-semibold text-cyan-700 dark:text-cyan-400">
                  {(feature.areaSqM / 10000).toFixed(2)} ha ({feature.areaSqM.toLocaleString()} m²)
                </span>
              </div>
            )}
            {feature.lengthM && (
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Corridor Length</span>
                <span className="font-mono font-semibold text-amber-700 dark:text-amber-400">
                  {feature.lengthM} meters
                </span>
              </div>
            )}
            {feature.evidenceDetails.debrisVolumeEstM3 && (
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Est. Debris Volume</span>
                <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                  ~{feature.evidenceDetails.debrisVolumeEstM3.toLocaleString()} m³
                </span>
              </div>
            )}
          </div>

          {/* Satellite Evidence Source */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-850/60 border border-slate-200 dark:border-navy-700/60">
            <div className="flex items-center gap-2 mb-1.5 text-slate-800 dark:text-slate-300 font-semibold">
              <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Evidence Pipeline & Sensor Trace</span>
            </div>
            <div className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
              <div><strong className="text-slate-500 dark:text-slate-400">Sensor:</strong> {feature.evidenceDetails.sensor}</div>
              <div><strong className="text-slate-500 dark:text-slate-400">Baseline Date:</strong> {feature.evidenceDetails.preEventDate} &rarr; <strong className="text-slate-500 dark:text-slate-400">Post Date:</strong> {feature.evidenceDetails.postEventDate}</div>
              <div><strong className="text-slate-500 dark:text-slate-400">Processing:</strong> {feature.source}</div>
            </div>
          </div>

          {/* Analyst Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Analyst Observations & Notes
              </span>
              {!isEditingNote && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="flex items-center gap-1 text-[11px] text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Note</span>
                </button>
              )}
            </div>

            {isEditingNote ? (
              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full h-20 p-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-600 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="px-2.5 py-1 rounded bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1 rounded bg-cyan-600 text-white font-medium hover:bg-cyan-500"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : (
              <p className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {feature.analystNotes}
              </p>
            )}
          </div>

          {/* Recommended Next Step */}
          <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60">
            <span className="font-semibold text-cyan-900 dark:text-cyan-300 block mb-1">Recommended Response Directive</span>
            <p className="text-cyan-950 dark:text-cyan-100/90 leading-relaxed">{feature.recommendedAction}</p>
          </div>

          {/* Status Override for Decision Makers */}
          <div className="pt-2 border-t border-slate-200 dark:border-navy-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2 uppercase tracking-wider">
              Update Operational Status (Simulate Field Triage)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["Needs Inspection", "Under Review", "Field Verified", "Insufficient Evidence"] as VerificationStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(feature.id, status)}
                    className={`px-2 py-1.5 rounded text-[11px] font-medium border text-center transition-all ${
                      feature.status === status
                        ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-500 ring-1 ring-cyan-500 font-semibold"
                        : "bg-slate-100 dark:bg-navy-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-700 hover:bg-slate-200 dark:hover:bg-navy-750 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-slate-50 dark:bg-navy-850 border-t border-slate-200 dark:border-navy-700/80 flex items-center justify-between text-xs">
          <button
            onClick={copyGeoJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-750 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-navy-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "GeoJSON Copied!" : "Copy GeoJSON Feature"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-900/20 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
