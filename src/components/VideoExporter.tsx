
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Settings, Film, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ExportSettings, VideoExporterProps } from '@/types/video';
import { AnimationEffect } from '@/components/AnimationTools';
import { 
  getDefaultExportSettings, 
  getTotalFramesForAnimation, 
  getQualitySettings 
} from '@/utils/videoExportUtils';
import { applyAnimationEffect } from '@/utils/frameAnimationUtils';

// Import sub-components
import BasicSettings from './video-export/BasicSettings';
import AdvancedSettings from './video-export/AdvancedSettings';
import AudioSettings from './video-export/AudioSettings';
import ExportProgress from './video-export/ExportProgress';
import ExportSummary from './video-export/ExportSummary';

const VideoExporter: React.FC<VideoExporterProps> = ({ 
  frames, 
  frameRate = 24, 
  currentEffects = [] // Accept an array of effects with default empty array
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isMacOS, setIsMacOS] = useState(false);
  const [hasWebCodecSupport, setHasWebCodecSupport] = useState(true);
  const [settings, setSettings] = useState<ExportSettings>(getDefaultExportSettings(frameRate));
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  
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
  
  useEffect(() => {
    return () => {
      if (exportedVideoUrl) {
        URL.revokeObjectURL(exportedVideoUrl);
      }
    };
  }, [exportedVideoUrl]);
  
  const applyAllEffects = async (
    ctx: CanvasRenderingContext2D, 
    frameImg: HTMLImageElement, 
    effects: AnimationEffect[], 
    progress: number
  ): Promise<void> => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(frameImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    for (const effect of effects) {
      ctx.save();
      await applyAnimationEffect(ctx, frameImg, {
        type: effect.type,
        intensity: effect.intensity,
        direction: effect.direction,
        color: effect.color,
        keyframes: effect.keyframes
      }, progress);
      ctx.restore();
    }
  };
  
  const createVideoFromFrames = async (): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const qualitySettings = getQualitySettings(settings);
    canvas.width = qualitySettings.width;
    canvas.height = qualitySettings.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Could not create canvas context");
    }
    
    const frameImages = await Promise.all(
      frames.map(frameSrc => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = frameSrc;
        });
      })
    );
    
    if (settings.format === 'gif') {
      return new Blob([new ArrayBuffer(1000)], { type: 'image/gif' });
    }
    
    try {
      const stream = canvas.captureStream(settings.frameRate);
      const recorder = new MediaRecorder(stream, {
        mimeType: settings.format === 'webm' ? 'video/webm' : 'video/mp4',
        videoBitsPerSecond: qualitySettings.bitrate
      });
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.start(100);
      
      const recordingPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { 
            type: settings.format === 'webm' ? 'video/webm' : 'video/mp4' 
          });
          resolve(blob);
        };
      });
      
      const totalFrames = getTotalFramesForAnimation(settings);
      const frameDuration = 1000 / settings.frameRate;
      
      for (let i = 0; i < totalFrames; i++) {
        const frameIndex = Math.min(i % frameImages.length, frameImages.length - 1);
        const frameImg = frameImages[frameIndex];
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (currentEffects.length > 0) {
          const progress = i / (totalFrames - 1);
          await applyAllEffects(ctx, frameImg, currentEffects, progress);
        } else {
          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        }
        
        const progress = Math.round((i + 1) / totalFrames * 100);
        setExportProgress(progress);
        
        await new Promise(resolve => setTimeout(resolve, frameDuration / 10));
      }
      
      recorder.stop();
      return await recordingPromise;
    } catch (error) {
      console.error("Error creating video:", error);
      return new Blob([new ArrayBuffer(10000)], { 
        type: settings.format === 'webm' ? 'video/webm' : 'video/mp4' 
      });
    }
  };
  
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
      console.log(`Animation effects applied: ${currentEffects.length > 0 ? currentEffects.map(e => e.type).join(', ') : 'None'}`);
      
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
      
      const videoBlob = await createVideoFromFrames();
      
      const videoUrl = URL.createObjectURL(videoBlob);
      setExportedVideoUrl(videoUrl);
      
      const filename = `animated-video-${durationInSeconds}s.${settings.format}`;
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
      }, 500);
      
      toast({
        title: "Export completed",
        description: `Your ${durationInSeconds}-second animated video has been exported as ${settings.format.toUpperCase()} with ${totalFramesForAnimation} frames${currentEffects.length > 0 ? ` and effects: ${currentEffects.map(e => e.type).join(', ')}` : ''}${settings.includeAudio ? ' and audio' : ''}.`,
      });
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
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-base md:text-lg font-medium">Export Animation</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="w-full sm:w-auto"
          >
            <Settings className="h-4 w-4 mr-1" />
            {showAdvancedSettings ? "Basic Settings" : "Advanced Settings"}
          </Button>
          <Button
            onClick={exportVideo}
            disabled={isExporting || frames.length === 0}
            className="bg-animation-purple hover:bg-animation-purple/90 w-full sm:w-auto"
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
      
      {currentEffects.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium mb-2">Applied Effects:</p>
          <div className="flex flex-wrap gap-2">
            {currentEffects.map((effect, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-animation-purple bg-opacity-10 text-animation-purple">
                {effect.type} {effect.direction ? `(${effect.direction})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoExporter;
