
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Download, Film } from 'lucide-react';

interface VideoExporterProps {
  frames: string[];
  frameRate?: number;
}

const VideoExporter: React.FC<VideoExporterProps> = ({ frames, frameRate = 24 }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportQuality, setExportQuality] = useState("medium");
  const [exportFormat, setExportFormat] = useState("mp4");
  const { toast } = useToast();
  
  const getQualitySettings = () => {
    switch (exportQuality) {
      case "low":
        return { width: 640, height: 360, bitrate: 1000000 };
      case "medium":
        return { width: 1280, height: 720, bitrate: 2500000 };
      case "high":
        return { width: 1920, height: 1080, bitrate: 5000000 };
      default:
        return { width: 1280, height: 720, bitrate: 2500000 };
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
      
      // Simulate video export process
      let progress = 0;
      const totalSteps = frames.length + 20; // Additional steps for encoding
      
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
              description: "Your animated video has been exported successfully.",
            });
            
            // Simulate download
            const a = document.createElement("a");
            a.href = "#";
            a.download = `animated-video.${exportFormat}`;
            a.click();
          }, 1000);
        }
      }, 100);
      
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
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Export Animation</h3>
        <Button
          onClick={exportVideo}
          disabled={isExporting || frames.length === 0}
          className="bg-animation-purple hover:bg-animation-purple/90"
        >
          {isExporting ? "Exporting..." : "Export Video"}
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {isExporting ? (
        <div className="space-y-2 my-4">
          <div className="flex items-center justify-between text-sm">
            <span>Exporting video...</span>
            <span>{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} className="h-2" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quality</label>
            <Select
              value={exportQuality}
              onValueChange={setExportQuality}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (640x360)</SelectItem>
                <SelectItem value="medium">Medium (720p)</SelectItem>
                <SelectItem value="high">High (1080p)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select
              value={exportFormat}
              onValueChange={setExportFormat}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="webm">WebM</SelectItem>
                <SelectItem value="gif">GIF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="text-sm text-animation-gray-500">
        <p>Frame count: {frames.length} frames</p>
        <p>Frame rate: {frameRate} fps</p>
        <p>Estimated duration: {(frames.length / frameRate).toFixed(1)} seconds</p>
      </div>
    </div>
  );
};

export default VideoExporter;
