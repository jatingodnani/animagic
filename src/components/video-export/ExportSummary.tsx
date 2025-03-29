
import React from 'react';
import { getQualitySettings, getTotalFramesForAnimation } from "@/utils/videoExportUtils";
import { ExportSettings } from '@/types/video';

interface ExportSummaryProps {
  settings: ExportSettings;
  frames: string[];
  isMacOS: boolean;
}

const ExportSummary: React.FC<ExportSummaryProps> = ({ settings, frames, isMacOS }) => {
  return (
    <div className="text-sm text-animation-gray-500">
      <p>Frame count: {frames.length} frames</p>
      <p>Frame rate: {settings.frameRate} fps</p>
      <p>Animation duration: {settings.duration} seconds</p>
      <p>Total animation frames: {getTotalFramesForAnimation(settings)} frames</p>
      <p>Output resolution: {settings.useCustomResolution 
        ? `${settings.customWidth}x${settings.customHeight}` 
        : `${getQualitySettings(settings).width}x${getQualitySettings(settings).height}`}
      </p>
      <p>Export format: {settings.format.toUpperCase()}{isMacOS && settings.format === "gif" ? " (Best for Mac)" : ""}</p>
      {settings.includeAudio && settings.audioFile && (
        <p>Audio: {settings.audioFile.name} ({(settings.audioFile.size / (1024 * 1024)).toFixed(2)}MB) at {settings.audioVolume}% volume</p>
      )}
    </div>
  );
};

export default ExportSummary;
