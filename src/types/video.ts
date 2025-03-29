
export interface ExportSettings {
  quality: string;
  format: string;
  frameRate: number;
  duration: string;
  resolution: { width: number; height: number };
  customWidth: number;
  customHeight: number;
  useCustomResolution: boolean;
  includeWatermark: boolean;
  compressionLevel: number;
  includeAudio: boolean;
  audioFile: File | null;
  audioVolume: number;
}

export interface VideoExporterProps {
  frames: string[];
  frameRate?: number;
}

export interface PerformanceMetrics {
  frameExtractionTime: number;
  processingTime: number;
  exportTime: number;
  memoryUsage: number;
  compressionRatio: number;
}
