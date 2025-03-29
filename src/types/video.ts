
import { AnimationEffect } from "@/components/AnimationTools";

export interface ExportSettings {
  quality: "low" | "medium" | "high" | "ultra";
  format: "mp4" | "webm" | "gif" | "mov";
  frameRate: number;
  duration: string;
  resolution: {
    width: number;
    height: number;
  };
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
  currentEffects?: AnimationEffect[]; // Changed from currentEffect to currentEffects array
}
