export type FeatureCategory = 
  | 'debris_zone' 
  | 'road_segment' 
  | 'infrastructure' 
  | 'river_channel' 
  | 'field_verification';

export type VerificationStatus = 
  | 'Needs Inspection' 
  | 'Under Review' 
  | 'Field Verified' 
  | 'Insufficient Evidence';

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface DisasterFeature {
  id: string;
  name: string;
  category: FeatureCategory;
  status: VerificationStatus;
  confidence: number; // 0 to 100
  observationDate: string;
  source: string;
  coordinates: [number, number]; // center/representative point [lat, lng]
  polygonCoords?: [number, number][]; // for polygons
  lineCoords?: [number, number][]; // for road polylines
  areaSqM?: number;
  lengthM?: number;
  riskLevel: RiskLevel;
  analystNotes: string;
  recommendedAction: string;
  lastUpdated: string;
  evidenceDetails: {
    sensor: string;
    resolution: string;
    preEventDate: string;
    postEventDate: string;
    elevationDropM?: number;
    debrisVolumeEstM3?: number;
  };
}

export interface RoadAssessmentItem {
  segmentId: string;
  roadName: string;
  locationKm: string;
  flagReason: string;
  evidenceSource: string;
  confidence: number;
  status: VerificationStatus;
  riskLevel: RiskLevel;
  lastObservation: string;
  recommendedAction: string;
  centerCoords: [number, number];
  lengthMeters: number;
  detourPossible: boolean;
}

export interface SatelliteDataSource {
  id: string;
  name: string;
  satellite: string;
  sensor: string;
  type: 'Optical (Multispectral)' | 'SAR (C-Band Synthetic Aperture Radar)' | 'Digital Elevation Model (DEM)';
  acquisitionDate: string;
  coverage: string;
  spatialResolution: string;
  cloudCover: string;
  processingLevel: string;
  status: 'Ready' | 'Calibrated' | 'Processing' | 'Reference Baseline';
  licensing: string;
  metadataUrl: string;
}

export interface ChangeDetectionResult {
  step: number;
  stepName: string;
  timestamp: string;
  status: 'pending' | 'running' | 'completed';
  details: string;
}
