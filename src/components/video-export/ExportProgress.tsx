
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { getTotalFramesForAnimation } from "@/utils/videoExportUtils";
import { ExportSettings } from '@/types/video';

interface ExportProgressProps {
  exportProgress: number;
  settings: ExportSettings;
}

const ExportProgress: React.FC<ExportProgressProps> = ({ exportProgress, settings }) => {
  return (
    <div className="space-y-2 my-4">
      <div className="flex items-center justify-between text-sm">
        <span>Exporting video...</span>
        <span>{exportProgress}%</span>
      </div>
      <Progress value={exportProgress} className="h-2" />
      <p className="text-sm text-muted-foreground">
        Preparing your animation with {getTotalFramesForAnimation(settings)} frames at {settings.quality} quality
        {settings.includeAudio && " with audio"}
      </p>
    </div>
  );
};

export default ExportProgress;
