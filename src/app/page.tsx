"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Sidebar, NavTabId } from "@/components/Sidebar";
import { OverviewView } from "@/components/OverviewView";
import { ChangeDetectionView } from "@/components/ChangeDetectionView";
import { RoadAssessmentView } from "@/components/RoadAssessmentView";
import { DataSourcesView } from "@/components/DataSourcesView";
import { ReportsView } from "@/components/ReportsView";
import { AboutView } from "@/components/AboutView";
import { FeatureDetailModal } from "@/components/FeatureDetailModal";
import { DemoTourModal, DEMO_STEPS } from "@/components/DemoTourModal";
import { 
  MOCK_FEATURES, 
  MOCK_ROAD_ITEMS, 
  MOCK_SATELLITE_SOURCES, 
  STUDY_AREA_META 
} from "@/data/mockDisasterData";
import { DisasterFeature, VerificationStatus, RoadAssessmentItem } from "@/types/disaster";

// Dynamically import the DisasterMapView to avoid SSR issues with Leaflet
const DisasterMapView = dynamic(
  () => import("@/components/DisasterMapView").then((mod) => mod.DisasterMapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-62px)] flex items-center justify-center bg-navy-950 text-cyan-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span>INITIALIZING GEOSPATIAL MAP ENGINE & TILE LAYERS...</span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTabId>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Data State
  const [features, setFeatures] = useState<DisasterFeature[]>(MOCK_FEATURES);
  const [roadItems, setRoadItems] = useState<RoadAssessmentItem[]>(MOCK_ROAD_ITEMS);
  const [selectedFeature, setSelectedFeature] = useState<DisasterFeature | null>(null);

  // Demo Presentation Mode State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);

  // Update Status
  const handleUpdateStatus = (featureId: string, newStatus: VerificationStatus) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, status: newStatus } : f))
    );

    // Sync with road items if it's a road segment
    setRoadItems((prev) =>
      prev.map((rd) => (rd.segmentId === featureId ? { ...rd, status: newStatus } : rd))
    );

    if (selectedFeature && selectedFeature.id === featureId) {
      setSelectedFeature((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Save Analyst Note
  const handleSaveNote = (featureId: string, newNote: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, analystNotes: newNote } : f))
    );
    if (selectedFeature && selectedFeature.id === featureId) {
      setSelectedFeature((prev) => (prev ? { ...prev, analystNotes: newNote } : null));
    }
  };

  // Demo Tour Navigation
  const startDemo = () => {
    setIsDemoRunning(true);
    setDemoStepIndex(0);
    const firstStep = DEMO_STEPS[0];
    setActiveTab(firstStep.tab);
  };

  const nextDemoStep = () => {
    if (demoStepIndex < DEMO_STEPS.length - 1) {
      const nextIndex = demoStepIndex + 1;
      setDemoStepIndex(nextIndex);
      const nextStep = DEMO_STEPS[nextIndex];
      setActiveTab(nextStep.tab);

      // If step targets a specific feature, auto select it
      if (nextStep.targetFeatureId) {
        const target = features.find((f) => f.id === nextStep.targetFeatureId);
        if (target) {
          setSelectedFeature(target);
        }
      }
    } else {
      setIsDemoRunning(false);
    }
  };

  const prevDemoStep = () => {
    if (demoStepIndex > 0) {
      const prevIndex = demoStepIndex - 1;
      setDemoStepIndex(prevIndex);
      const prevStep = DEMO_STEPS[prevIndex];
      setActiveTab(prevStep.tab);
      if (prevStep.targetFeatureId) {
        const target = features.find((f) => f.id === prevStep.targetFeatureId);
        if (target) setSelectedFeature(target);
      }
    }
  };

  const resetDemo = () => {
    setIsDemoRunning(false);
    setDemoStepIndex(0);
    setFeatures(MOCK_FEATURES);
    setRoadItems(MOCK_ROAD_ITEMS);
    setSelectedFeature(null);
    setActiveTab("overview");
  };

  const handleSelectSegmentFromRoadTable = (segmentId: string) => {
    const target = features.find((f) => f.id === segmentId);
    if (target) {
      setSelectedFeature(target);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Application Header */}
      <Header
        onStartDemo={startDemo}
        onResetDemo={resetDemo}
        isDemoRunning={isDemoRunning}
        activeTab={activeTab}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
          }}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          flaggedRoadCount={roadItems.filter((r) => r.status === "Needs Inspection").length}
          debrisCount={features.filter((f) => f.category === "debris_zone").length}
        />

        {/* Dynamic Main View Area */}
        <section className="flex-1 overflow-y-auto bg-slate-50/90 dark:bg-navy-950/90 relative transition-colors duration-200">
          {activeTab === "overview" && (
            <OverviewView
              features={features}
              selectedFeatureId={selectedFeature?.id || null}
              onSelectFeature={(feat) => setSelectedFeature(feat)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "map" && (
            <DisasterMapView
              features={features}
              selectedFeatureId={selectedFeature?.id || null}
              onSelectFeature={(feat) => setSelectedFeature(feat)}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {activeTab === "change-detection" && (
            <ChangeDetectionView
              features={features}
              onSelectFeature={(feat) => setSelectedFeature(feat)}
              onNavigateToMap={() => setActiveTab("map")}
            />
          )}

          {activeTab === "road-assessment" && (
            <RoadAssessmentView
              roadItems={roadItems}
              onSelectSegment={handleSelectSegmentFromRoadTable}
              onUpdateSegmentStatus={handleUpdateStatus}
            />
          )}

          {activeTab === "reports" && (
            <ReportsView
              features={features}
              roadItems={roadItems}
            />
          )}

          {activeTab === "data-sources" && (
            <DataSourcesView
              sources={MOCK_SATELLITE_SOURCES}
            />
          )}

          {activeTab === "about" && (
            <AboutView />
          )}
        </section>
      </div>

      {/* Feature Detail Inspector Modal */}
      {selectedFeature && (
        <FeatureDetailModal
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
          onUpdateStatus={handleUpdateStatus}
          onSaveNote={handleSaveNote}
          onFocusMap={(feat) => {
            setSelectedFeature(feat);
            setActiveTab("map");
          }}
        />
      )}

      {/* Evaluator Guided Demo Modal Overlay */}
      {isDemoRunning && (
        <DemoTourModal
          currentStepIndex={demoStepIndex}
          onNextStep={nextDemoStep}
          onPrevStep={prevDemoStep}
          onCloseDemo={() => setIsDemoRunning(false)}
          onResetDemo={resetDemo}
        />
      )}
    </main>
  );
}
