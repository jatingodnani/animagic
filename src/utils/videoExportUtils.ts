
import { ExportSettings } from "@/types/video";

export const getQualityBitrate = (quality: string): number => {
  switch (quality) {
    case "low": return 1000000;
    case "medium": return 2500000;
    case "high": return 5000000;
    case "ultra": return 12000000;
    default: return 2500000;
  }
};

export const getQualitySettings = (settings: ExportSettings) => {
  if (settings.useCustomResolution) {
    return {
      width: settings.customWidth,
      height: settings.customHeight,
      bitrate: getQualityBitrate(settings.quality)
    };
  }
  
  switch (settings.quality) {
    case "low":
      return { width: 640, height: 360, bitrate: 1000000 };
    case "medium":
      return { width: 1280, height: 720, bitrate: 2500000 };
    case "high":
      return { width: 1920, height: 1080, bitrate: 5000000 };
    case "ultra":
      return { width: 3840, height: 2160, bitrate: 12000000 };
    default:
      return { width: 1280, height: 720, bitrate: 2500000 };
  }
};

export const getTotalFramesForAnimation = (settings: ExportSettings): number => {
  const duration = parseFloat(settings.duration);
  if (isNaN(duration) || duration <= 0) return settings.frameRate * 5;
  return Math.round(duration * settings.frameRate);
};

export const getAvailableFormats = (isMacOS: boolean, hasWebCodecSupport: boolean): string[] => {
  if (!hasWebCodecSupport) {
    return ["gif"];
  }
  
  if (isMacOS) {
    return ["mp4", "webm", "gif"];
  }
  
  return ["mp4", "webm", "gif", "mov"];
};

export const getDefaultExportSettings = (frameRate: number): ExportSettings => ({
  quality: "medium",
  format: "mp4",
  frameRate: frameRate,
  duration: "5",
  resolution: { width: 1280, height: 720 },
  customWidth: 1280,
  customHeight: 1280,
  useCustomResolution: false,
  includeWatermark: false,
  compressionLevel: 50,
  includeAudio: false,
  audioFile: null,
  audioVolume: 80
});
