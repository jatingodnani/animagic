
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Layers, Play } from 'lucide-react';

interface FrameExtractorProps {
  videoUrl: string;
  onFramesExtracted: (frames: string[]) => void;
}

const FrameExtractor: React.FC<FrameExtractorProps> = ({ videoUrl, onFramesExtracted }) => {
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [videoInfo, setVideoInfo] = useState({ duration: 0, width: 0, height: 0 });
  const { toast } = useToast();
  
  const extractFrames = async () => {
    try {
      setIsExtracting(true);
      setExtractionProgress(0);
      
      // Create a video element to get video information
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => resolve(null);
      });
      
      const duration = videoElement.duration;
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;
      
      setVideoInfo({ duration, width, height });
      
      // We'll extract frames at 1 frame per second
      const frameRate = 1;
      const framesToExtract = Math.ceil(duration * frameRate);
      const frames: string[] = [];
      
      // Create a canvas for frame extraction
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not create canvas context");
      }
      
      // Extract frames at specified intervals
      for (let i = 0; i < framesToExtract; i++) {
        const time = i / frameRate;
        videoElement.currentTime = time;
        
        await new Promise((resolve) => {
          videoElement.onseeked = () => resolve(null);
        });
        
        // Draw the video frame on the canvas and convert to data URL
        ctx.drawImage(videoElement, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        frames.push(dataUrl);
        
        // Update progress
        const progress = Math.round((i + 1) / framesToExtract * 100);
        setExtractionProgress(progress);
      }
      
      // Pass the extracted frames to the parent component
      onFramesExtracted(frames);
      toast({
        title: "Frames extracted successfully",
        description: `${frames.length} frames extracted and ready for editing`,
      });
    } catch (error) {
      console.error("Error extracting frames:", error);
      toast({
        title: "Error extracting frames",
        description: "An error occurred during frame extraction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-base md:text-lg font-medium">Frame Extraction</h3>
        <Button
          onClick={extractFrames}
          disabled={isExtracting}
          className="bg-animation-purple hover:bg-animation-purple/90 w-full sm:w-auto"
        >
          {isExtracting ? "Extracting..." : "Extract Frames"}
          <Layers className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {isExtracting && (
        <div className="space-y-2 my-4">
          <div className="flex items-center justify-between text-sm">
            <span>Extracting frames...</span>
            <span>{extractionProgress}%</span>
          </div>
          <Progress value={extractionProgress} className="h-2" />
        </div>
      )}
      
      <div className="text-sm text-animation-gray-500 space-y-1">
        <p>This will extract frames from your video for animation editing.</p>
        <p>The process may take a few minutes depending on the video length.</p>
        {videoInfo.duration > 0 && (
          <div className="pt-2 space-y-1">
            <p>Video duration: {Math.round(videoInfo.duration * 10) / 10} seconds</p>
            <p>Resolution: {videoInfo.width} x {videoInfo.height}</p>
            <p>Estimated frames: {Math.ceil(videoInfo.duration)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameExtractor;
