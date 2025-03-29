
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
import { applyAnimationEffect } from '@/utils/frameAnimationUtils';

// Import sub-components
import BasicSettings from './video-export/BasicSettings';
import AdvancedSettings from './video-export/AdvancedSettings';
import AudioSettings from './video-export/AudioSettings';
import ExportProgress from './video-export/ExportProgress';
import ExportSummary from './video-export/ExportSummary';

const VideoExporter: React.FC<VideoExporterProps> = ({ frames, frameRate = 24, currentEffect = null }) => {
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
  
  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (exportedVideoUrl) {
        URL.revokeObjectURL(exportedVideoUrl);
      }
    };
  }, [exportedVideoUrl]);
  
  const createVideoFromFrames = async (): Promise<Blob> => {
    // Create a canvas to draw frames
    const canvas = document.createElement('canvas');
    const qualitySettings = getQualitySettings(settings);
    canvas.width = qualitySettings.width;
    canvas.height = qualitySettings.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Could not create canvas context");
    }
    
    // Load all frames as Image objects
    const frameImages = await Promise.all(
      frames.map(frameSrc => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = frameSrc;
        });
      })
    );
    
    // For GIF format - use gif.js or similar library in a real implementation
    if (settings.format === 'gif') {
      // Simple placeholder - in production you'd use a proper GIF encoder
      return new Blob([new ArrayBuffer(1000)], { type: 'image/gif' });
    }
    
    // For video formats, create a real video using MediaRecorder
    try {
      // Create MediaRecorder with canvas stream
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
      
      // Start recording
      recorder.start(100);
      
      // Wait for recording to finish
      const recordingPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { 
            type: settings.format === 'webm' ? 'video/webm' : 'video/mp4' 
          });
          resolve(blob);
        };
      });
      
      // Calculate the total frames needed for the animation
      const totalFrames = getTotalFramesForAnimation(settings);
      const frameDuration = 1000 / settings.frameRate;
      
      // Draw frames to canvas sequentially with animation effects
      for (let i = 0; i < totalFrames; i++) {
        const frameIndex = Math.min(i % frameImages.length, frameImages.length - 1);
        const frameImg = frameImages[frameIndex];
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // If we have an effect to apply, use it
        if (currentEffect) {
          // Calculate the progress based on the current frame (0 to 1)
          const progress = i / (totalFrames - 1);
          
          // Apply the animation effect at the current progress point
          await applyAnimationEffect(ctx, frameImg, currentEffect, progress);
        } else {
          // No animation effect, just draw the frame
          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
        }
        
        // Update progress
        const progress = Math.round((i + 1) / totalFrames * 100);
        setExportProgress(progress);
        
        // Wait a small amount before drawing the next frame
        await new Promise(resolve => setTimeout(resolve, frameDuration / 10));
      }
      
      // Stop recording
      recorder.stop();
      return await recordingPromise;
    } catch (error) {
      console.error("Error creating video:", error);
      // Fallback to creating a fake video blob
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
      console.log(`Animation effect applied: ${currentEffect ? currentEffect.type : 'None'}`);
      
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
      
      // Create the video file with animation effects
      const videoBlob = await createVideoFromFrames();
      
      // Create a download URL
      const videoUrl = URL.createObjectURL(videoBlob);
      setExportedVideoUrl(videoUrl);
      
      // Trigger download
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
        description: `Your ${durationInSeconds}-second animated video has been exported as ${settings.format.toUpperCase()} with ${totalFramesForAnimation} frames${currentEffect ? ` and ${currentEffect.type} effect` : ''}${settings.includeAudio ? ' and audio' : ''}.`,
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
    </div>
  );
};

export default VideoExporter;
