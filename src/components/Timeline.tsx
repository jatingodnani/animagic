
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Maximize2 } from 'lucide-react';

interface TimelineProps {
  frames: string[];
  onFrameSelect: (index: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ frames, onFrameSelect }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  
  // Playback logic
  React.useEffect(() => {
    if (!isPlaying || frames.length === 0) return;
    
    const speed = Number(playbackSpeed);
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = prev + 1;
        if (next >= frames.length) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 1000 / speed);
    
    return () => clearInterval(interval);
  }, [isPlaying, frames.length, playbackSpeed]);
  
  // Update parent when current frame changes
  React.useEffect(() => {
    onFrameSelect(currentFrame);
  }, [currentFrame, onFrameSelect]);
  
  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handlePrevFrame = () => {
    setIsPlaying(false);
    setCurrentFrame((prev) => Math.max(0, prev - 1));
  };
  
  const handleNextFrame = () => {
    setIsPlaying(false);
    setCurrentFrame((prev) => Math.min(frames.length - 1, prev + 1));
  };
  
  const handleSliderChange = (value: number[]) => {
    setIsPlaying(false);
    setCurrentFrame(value[0]);
  };
  
  const handleFrameClick = (index: number) => {
    setIsPlaying(false);
    setCurrentFrame(index);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Timeline</h3>
          <div className="flex items-center space-x-2">
            <Select
              value={playbackSpeed}
              onValueChange={setPlaybackSpeed}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="4">4x</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="outline" onClick={handlePrevFrame}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handlePlay}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button size="icon" variant="outline" onClick={handleNextFrame}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {frames.length > 0 && (
          <div className="mt-4">
            <Slider 
              value={[currentFrame]} 
              min={0} 
              max={frames.length - 1} 
              step={1}
              onValueChange={handleSliderChange}
            />
            <div className="flex justify-between text-xs text-animation-gray-500 mt-1">
              <span>Frame {currentFrame + 1}</span>
              <span>Total: {frames.length} frames</span>
            </div>
          </div>
        )}
      </div>
      
      <ScrollArea className="h-40">
        <div className="flex p-4 gap-2">
          {frames.map((frame, index) => (
            <div 
              key={index}
              className={`timeline-item cursor-pointer flex-shrink-0 w-[100px] h-[56px] ${
                index === currentFrame ? "ring-2 ring-animation-purple" : ""
              }`}
              onClick={() => handleFrameClick(index)}
            >
              <img 
                src={frame} 
                alt={`Frame ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
                <span className="text-white text-xs">{index + 1}</span>
              </div>
            </div>
          ))}
          {frames.length === 0 && (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-sm text-animation-gray-500">
                Extract frames from your video to see them here.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Timeline;
