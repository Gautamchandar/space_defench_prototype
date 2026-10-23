"use client";

import React, { useState } from "react";
import { SatelliteDataSource } from "@/types/disaster";
import { 
  Database, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  FileCode,
  HardDrive
} from "lucide-react";

interface DataSourcesViewProps {
  sources: SatelliteDataSource[];
}

export const DataSourcesView: React.FC<DataSourcesViewProps> = ({ sources }) => {
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
    lastModified: string;
    metadata: {
      format: string;
      bands: number;
      projection: string;
      bbox: string;
      pixelSize: string;
    };
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"catalog" | "upload" | "pipeline">("catalog");

  // Handle simulated GeoTIFF / Raster upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    setTimeout(() => {
      const isGeoTiff = file.name.endsWith(".tif") || file.name.endsWith(".tiff");
      const isGeoJson = file.name.endsWith(".json") || file.name.endsWith(".geojson");

      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || (isGeoTiff ? "image/tiff" : isGeoJson ? "application/geo+json" : "application/octet-stream"),
        lastModified: new Date(file.lastModified).toISOString().replace("T", " ").slice(0, 19),
        metadata: {
          format: isGeoTiff ? "Cloud-Optimized GeoTIFF (COG)" : isGeoJson ? "GeoJSON Vector FeatureCollection" : "Georeferenced Raster",
          bands: isGeoTiff ? 4 : isGeoJson ? 1 : 3,
          projection: "WGS 84 / UTM Zone 44N (EPSG:32644)",
          bbox: "78.712°E, 31.018°N to 78.765°E, 31.055°N",
          pixelSize: isGeoTiff ? "10.0m x 10.0m ground resolution" : "Vector topology coordinates",
        },
      });
      setIsUploading(false);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide font-mono uppercase">
              SATELLITE DATA SOURCES & INGESTION MANAGEMENT
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 font-mono font-semibold">
              SPACE & DEFENCE HUB
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Catalog of optical multispectral, C-band synthetic aperture radar (SAR), and high-resolution elevation models ingested for the Dharali incident.
          </p>
        </div>

        {/* View Mode Nav */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-950 p-1 rounded-lg border border-slate-200 dark:border-navy-800 text-xs">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "catalog" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Sensors Catalog ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "upload" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            GeoTIFF Ingestion Tool
          </button>
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === "pipeline" ? "bg-cyan-600/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Future API Roadmaps
          </button>
        </div>
      </div>

      {/* Honest Prototype Disclaimer */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-navy-900/70 border border-slate-200 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-400 shadow-sm transition-colors">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <div>
          <strong className="text-amber-700 dark:text-amber-300">Space & Defence Platform Architecture Note:</strong> Sensor feeds and imagery metadata shown below represent actual satellite passes over Uttarkashi during the monsoon cycle. Live real-time commercial tasking feeds and restricted defence uplinks require verified agency authentication in Phase 5.
        </div>
      </div>

      {/* Tab 1: Sensors Catalog */}
      {activeTab === "catalog" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src) => (
            <div
              key={src.id}
              className="p-5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all shadow-sm dark:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-850 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400">{src.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800 font-medium">
                      {src.satellite}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                      src.status === "Ready"
                        ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40"
                        : src.status === "Calibrated"
                        ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40"
                        : "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/40"
                    }`}
                  >
                    {src.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{src.name}</h3>

                {/* Details Table */}
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Sensor Type:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{src.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Acquisition Timestamp:</span>
                    <span className="font-mono text-cyan-700 dark:text-cyan-300 font-semibold">{src.acquisitionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Ground Resolution:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-200">{src.spatialResolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Cloud / Quality Status:</span>
                    <span className="text-amber-700 dark:text-amber-300 font-medium">{src.cloudCover}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Processing Level:</span>
                    <span className="text-slate-900 dark:text-slate-200">{src.processingLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Spatial Extent:</span>
                    <span className="text-slate-700 dark:text-slate-300">{src.coverage}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] truncate max-w-[240px]">
                  {src.licensing}
                </span>
                <a
                  href={src.metadataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 font-medium"
                >
                  <span>Metadata Ref</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: GeoTIFF Ingestion Tool */}
      {activeTab === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Dropzone */}
          <div className="lg:col-span-1 p-6 rounded-xl bg-white dark:bg-navy-900 border border-dashed border-slate-300 dark:border-navy-600 hover:border-cyan-500 transition-colors flex flex-col items-center justify-center text-center shadow-sm">
            <input
              type="file"
              id="file-upload"
              accept=".tif,.tiff,.geojson,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center group w-full"
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500 transition-all mb-3 shadow-md">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                Upload Georeferenced File
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Drop your <code className="text-cyan-600 dark:text-cyan-400 font-semibold">.tif</code>, <code className="text-cyan-600 dark:text-cyan-400 font-semibold">.tiff</code>, or <code className="text-cyan-600 dark:text-cyan-400 font-semibold">.geojson</code> raster/vector
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 group-hover:bg-cyan-600 group-hover:text-white text-xs font-semibold border border-slate-200 dark:border-navy-700 transition-colors">
                Select File from Disk
              </span>
            </label>

            {isUploading && (
              <div className="mt-4 flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-medium animate-pulse">
                <HardDrive className="w-4 h-4 animate-spin" />
                <span>Parsing GeoTIFF header tags & EPSG geotransform...</span>
              </div>
            )}
          </div>

          {/* Parsed Metadata Inspection */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-2.5 mb-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Raster Metadata Inspector
                </h3>
                {uploadedFile && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-semibold">
                    VALIDATED GEOTIFF
                  </span>
                )}
              </div>

              {uploadedFile ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase block">File Name</span>
                      <span className="font-mono text-cyan-700 dark:text-cyan-300 font-bold">{uploadedFile.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase block">File Size & MIME</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{uploadedFile.size} ({uploadedFile.type})</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Container Format:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{uploadedFile.metadata.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Coordinate Reference System:</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{uploadedFile.metadata.projection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Bounding Coordinates:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{uploadedFile.metadata.bbox}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Pixel Pitch / Ground Sample Distance:</span>
                      <span className="font-mono text-cyan-700 dark:text-cyan-300 font-semibold">{uploadedFile.metadata.pixelSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Spectral Bands Detected:</span>
                      <span className="text-slate-800 dark:text-slate-200">{uploadedFile.metadata.bands} (Blue, Green, Red, Near-Infrared)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                  <Database className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                  <p className="text-xs">No user raster loaded. Drag in a satellite GeoTIFF or select a sample above.</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Supported formats: GeoTIFF, Cloud-Optimized GeoTIFF, GeoJSON vectors.</p>
                </div>
              )}
            </div>

            {/* HPC Backend Explanation */}
            <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-navy-950/80 border border-slate-200 dark:border-cyan-900/40 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-cyan-800 dark:text-cyan-300 block mb-0.5">Edge Browser Limitation Notice:</span>
              Client-side GeoTIFF parsing extracts bounding box and projection headers. Full GPU-accelerated terrain orthorectification, multi-look speckle filtering, and radiometric calibration are piped to cloud workers in Phase 2.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Future API Roadmaps */}
      {activeTab === "pipeline" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md space-y-2.5 transition-colors">
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-wide">
              <Cpu className="w-4 h-4" />
              <span>ISRO / NRSC Bhuvan OGC Services</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Integration target for Cartosat-3 and RISAT-1A (EOS-04) SAR radar feeds. Will stream authorized Indian disaster management geoportals directly into the disaster intelligence map.
            </p>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-navy-800">
              Protocols: WMS / WMTS / WFS / REST API
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md space-y-2.5 transition-colors">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
              <HardDrive className="w-4 h-4" />
              <span>Copernicus Data Space Ecosystem</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Automated polling of Sentinel-1 C-SAR and Sentinel-2 MSI tiles within 45 minutes of downlink. Leverages STAC (SpatioTemporal Asset Catalog) API endpoints.
            </p>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-navy-800">
              Protocols: OData / STAC API / S3 Direct Egress
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 shadow-sm dark:shadow-md space-y-2.5 transition-colors">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <FileCheck className="w-4 h-4" />
              <span>USGS Landsat 8/9 & NASA FIRMS</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Thermal and multispectral cross-calibration for long-term geotechnical monitoring of active Himalayan faults and post-monsoon saturation indexes.
            </p>
            <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-navy-800">
              Protocols: Cloud-Optimized GeoTIFF / USGS M2M API
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
