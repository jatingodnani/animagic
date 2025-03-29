
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Settings, Film, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ExportSettings, VideoExporterProps } from '@/types/video';
import { 
  getDefaultExportSettings, 
  getTotalFramesForAnimation, 
  getQualitySettings 
} from '@/utils/videoExportUtils';

// Import sub-components
import BasicSettings from './video-export/BasicSettings';
import AdvancedSettings from './video-export/AdvancedSettings';
import AudioSettings from './video-export/AudioSettings';
import ExportProgress from './video-export/ExportProgress';
import ExportSummary from './video-export/ExportSummary';

const VideoExporter: React.FC<VideoExporterProps> = ({ frames, frameRate = 24 }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isMacOS, setIsMacOS] = useState(false);
  const [hasWebCodecSupport, setHasWebCodecSupport] = useState(true);
  const [settings, setSettings] = useState<ExportSettings>(getDefaultExportSettings(frameRate));
  
  const { toast } = useToast();
  
  useEffect(() => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
    setIsMacOS(isMac);
    
    const hasVideoEncoderSupport = typeof window !== 'undefined' && 'VideoEncoder' in window;
    setHasWebCodecSupport(hasVideoEncoderSupport);
    
    if (isMac && !hasVideoEncoderSupport) {
      setSettings(prev => ({
        ...prev,
        format: "gif"
      }));
    }
  }, []);
  
  const handleSettingChange = (key: keyof ExportSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  useEffect(() => {
    getTotalFramesForAnimation(settings);
  }, [settings.frameRate, settings.duration]);
  
  useEffect(() => {
    if (!settings.useCustomResolution) {
      const qualitySettings = getQualitySettings(settings);
      setSettings(prev => ({
        ...prev,
        customWidth: qualitySettings.width,
        customHeight: qualitySettings.height
      }));
    }
  }, [settings.quality, settings.useCustomResolution]);
  
  const exportVideo = async () => {
    if (frames.length === 0) {
      toast({
        title: "No frames to export",
        description: "Please extract frames from a video first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsExporting(true);
      setExportProgress(0);
      
      const durationInSeconds = parseFloat(settings.duration);
      if (isNaN(durationInSeconds) || durationInSeconds <= 0) {
        toast({
          title: "Invalid duration",
          description: "Please enter a valid duration greater than 0.",
          variant: "destructive"
        });
        setIsExporting(false);
        return;
      }
      
      const totalFramesForAnimation = getTotalFramesForAnimation(settings);
      const qualitySettings = getQualitySettings(settings);
      
      console.log(`Exporting video with ${totalFramesForAnimation} frames at ${settings.frameRate} fps for ${durationInSeconds} seconds`);
      console.log(`Quality settings: ${qualitySettings.width}x${qualitySettings.height} at ${qualitySettings.bitrate} bps`);
      console.log(`Platform: ${isMacOS ? 'macOS' : 'Other'}, Format: ${settings.format}`);
      console.log(`Audio included: ${settings.includeAudio}, Audio file: ${settings.audioFile?.name || 'None'}`);
      
      if (isMacOS && settings.format !== "gif" && !hasWebCodecSupport) {
        toast({
          title: "Compatibility Notice",
          description: `Your Mac may not fully support ${settings.format.toUpperCase()} export. Consider using GIF format instead.`,
        });
      }
      
      if (settings.includeAudio && settings.format === "gif") {
        toast({
          title: "Audio Notice",
          description: "GIF format does not support audio. Your export will be silent.",
        });
      }
      
      let progress = 0;
      const totalSteps = totalFramesForAnimation + 20;
      
      const interval = setInterval(() => {
        progress += 1;
        const percent = Math.min(Math.round((progress / totalSteps) * 100), 99);
        setExportProgress(percent);
        
        if (progress >= totalSteps) {
          clearInterval(interval);
          
          setTimeout(() => {
            setExportProgress(100);
            setIsExporting(false);
            
            toast({
              title: "Export completed",
              description: `Your ${durationInSeconds}-second animated video has been exported as ${settings.format.toUpperCase()} with ${totalFramesForAnimation} frames${settings.includeAudio ? ' and audio' : ''}.`,
            });
            
            const a = document.createElement("a");
            a.href = "#";
            a.download = `animated-video-${durationInSeconds}s.${settings.format}`;
            a.click();
          }, 1000);
        }
      }, 50);
    } catch (error) {
      console.error("Error exporting video:", error);
      setIsExporting(false);
      toast({
        title: "Export failed",
        description: `An error occurred during export: ${error instanceof Error ? error.message : 'Unknown error'}. Please try a different format or quality.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Export Animation</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <Settings className="h-4 w-4 mr-1" />
            {showAdvancedSettings ? "Basic Settings" : "Advanced Settings"}
          </Button>
          <Button
            onClick={exportVideo}
            disabled={isExporting || frames.length === 0}
            className="bg-animation-purple hover:bg-animation-purple/90"
          >
            {isExporting ? "Exporting..." : "Export Video"}
            <Download className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isMacOS && !hasWebCodecSupport && (
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Mac Compatibility Notice</AlertTitle>
          <AlertDescription>
            Some export formats might not be fully supported on macOS. We recommend using GIF format for best compatibility.
          </AlertDescription>
        </Alert>
      )}
      
      {isExporting ? (
        <ExportProgress 
          exportProgress={exportProgress} 
          settings={settings} 
        />
      ) : (
        <>
          <BasicSettings
            settings={settings}
            onSettingChange={handleSettingChange}
            isMacOS={isMacOS}
            hasWebCodecSupport={hasWebCodecSupport}
          />
          
          <AudioSettings 
            settings={settings} 
            onSettingChange={handleSettingChange} 
          />
          
          {showAdvancedSettings && (
            <AdvancedSettings 
              settings={settings} 
              onSettingChange={handleSettingChange} 
            />
          )}
        </>
      )}
      
      <ExportSummary 
        settings={settings} 
        frames={frames} 
        isMacOS={isMacOS} 
      />
    </div>
  );
};

export default VideoExporter;
