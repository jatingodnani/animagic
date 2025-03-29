
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Download, Film, Settings, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VideoExporterProps {
  frames: string[];
  frameRate?: number;
}

interface ExportSettings {
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
}

const VideoExporter: React.FC<VideoExporterProps> = ({ frames, frameRate = 24 }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [settings, setSettings] = useState<ExportSettings>({
    quality: "medium",
    format: "mp4",
    frameRate: frameRate,
    duration: "5",
    resolution: { width: 1280, height: 720 },
    customWidth: 1280,
    customHeight: 720,
    useCustomResolution: false,
    includeWatermark: false,
    compressionLevel: 50
  });
  
  const { toast } = useToast();
  
  // Calculate total frames based on duration and frame rate
  const getTotalFramesForAnimation = () => {
    const duration = parseFloat(settings.duration);
    if (isNaN(duration) || duration <= 0) return frameRate * 5; // Default to 5 seconds
    return Math.round(duration * settings.frameRate);
  };
  
  const getQualitySettings = () => {
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
  
  const getQualityBitrate = (quality: string) => {
    switch (quality) {
      case "low": return 1000000;
      case "medium": return 2500000;
      case "high": return 5000000;
      case "ultra": return 12000000;
      default: return 2500000;
    }
  };
  
  const handleSettingChange = (key: keyof ExportSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
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
      
      // Calculate total frames for the animation based on duration and frame rate
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
      
      const totalFramesForAnimation = getTotalFramesForAnimation();
      const qualitySettings = getQualitySettings();
      
      console.log(`Exporting video with ${totalFramesForAnimation} frames at ${settings.frameRate} fps for ${durationInSeconds} seconds`);
      console.log(`Quality settings: ${qualitySettings.width}x${qualitySettings.height} at ${qualitySettings.bitrate} bps`);
      
      // Simulate video export process
      let progress = 0;
      // Add more steps to account for the animation processing
      const totalSteps = totalFramesForAnimation + 20; // Additional steps for encoding
      
      const interval = setInterval(() => {
        progress += 1;
        const percent = Math.min(Math.round((progress / totalSteps) * 100), 99);
        setExportProgress(percent);
        
        if (progress >= totalSteps) {
          clearInterval(interval);
          
          // Simulated completion
          setTimeout(() => {
            setExportProgress(100);
            setIsExporting(false);
            
            toast({
              title: "Export completed",
              description: `Your ${durationInSeconds}-second animated video has been exported as ${settings.format.toUpperCase()} with ${totalFramesForAnimation} frames.`,
            });
            
            // Simulate download
            const a = document.createElement("a");
            a.href = "#";
            a.download = `animated-video-${durationInSeconds}s.${settings.format}`;
            a.click();
          }, 1000);
        }
      }, 50); // Faster simulation for better UX
      
    } catch (error) {
      console.error("Error exporting video:", error);
      setIsExporting(false);
      toast({
        title: "Export failed",
        description: "An error occurred during export. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Update duration when frame rate changes to maintain consistency
  useEffect(() => {
    // Just to ensure we have the latest calculations if frameRate changes
    getTotalFramesForAnimation();
  }, [settings.frameRate, settings.duration]);
  
  // Update custom resolution when quality changes
  useEffect(() => {
    if (!settings.useCustomResolution) {
      const qualitySettings = getQualitySettings();
      setSettings(prev => ({
        ...prev,
        customWidth: qualitySettings.width,
        customHeight: qualitySettings.height
      }));
    }
  }, [settings.quality, settings.useCustomResolution]);
  
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
      
      {isExporting ? (
        <div className="space-y-2 my-4">
          <div className="flex items-center justify-between text-sm">
            <span>Exporting video...</span>
            <span>{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Preparing your animation with {getTotalFramesForAnimation()} frames at {settings.quality} quality
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 my-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Animation Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="60"
              value={settings.duration}
              onChange={(e) => handleSettingChange('duration', e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-animation-gray-500">
              This will create a {getTotalFramesForAnimation()} frame animation at {settings.frameRate} fps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quality</label>
              <Select
                value={settings.quality}
                onValueChange={(value) => handleSettingChange('quality', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (640x360)</SelectItem>
                  <SelectItem value="medium">Medium (720p)</SelectItem>
                  <SelectItem value="high">High (1080p)</SelectItem>
                  <SelectItem value="ultra">Ultra HD (4K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select
                value={settings.format}
                onValueChange={(value) => handleSettingChange('format', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="webm">WebM</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                  <SelectItem value="mov">MOV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {showAdvancedSettings && (
            <div className="space-y-4 border-t pt-4 mt-2">
              <h4 className="text-sm font-medium flex items-center">
                Advanced Settings
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>These settings affect the output quality and file size</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="frameRate">Frame Rate (FPS)</Label>
                <Select
                  value={settings.frameRate.toString()}
                  onValueChange={(value) => handleSettingChange('frameRate', parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frame rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 fps (Film)</SelectItem>
                    <SelectItem value="30">30 fps (Standard)</SelectItem>
                    <SelectItem value="60">60 fps (Smooth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-resolution"
                    checked={settings.useCustomResolution}
                    onCheckedChange={(checked) => handleSettingChange('useCustomResolution', checked === true)}
                  />
                  <Label htmlFor="custom-resolution">Use custom resolution</Label>
                </div>
                
                {settings.useCustomResolution && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        min="320"
                        max="3840"
                        step="16"
                        value={settings.customWidth}
                        onChange={(e) => handleSettingChange('customWidth', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        min="240"
                        max="2160"
                        step="16"
                        value={settings.customHeight}
                        onChange={(e) => handleSettingChange('customHeight', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="compression">Compression Level</Label>
                  <span className="text-sm text-animation-gray-500">
                    {settings.compressionLevel}%
                  </span>
                </div>
                <Slider
                  id="compression"
                  min={10}
                  max={100}
                  step={1}
                  value={[settings.compressionLevel]}
                  onValueChange={(value) => handleSettingChange('compressionLevel', value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="watermark"
                  checked={settings.includeWatermark}
                  onCheckedChange={(checked) => handleSettingChange('includeWatermark', checked === true)}
                />
                <Label htmlFor="watermark">
                  Include watermark
                </Label>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="text-sm text-animation-gray-500">
        <p>Frame count: {frames.length} frames</p>
        <p>Frame rate: {settings.frameRate} fps</p>
        <p>Animation duration: {settings.duration} seconds</p>
        <p>Total animation frames: {getTotalFramesForAnimation()} frames</p>
        <p>Output resolution: {settings.useCustomResolution 
          ? `${settings.customWidth}x${settings.customHeight}` 
          : `${getQualitySettings().width}x${getQualitySettings().height}`}
        </p>
      </div>
    </div>
  );
};

export default VideoExporter;
