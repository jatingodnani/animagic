
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipForward, Film, ChevronRight, ChevronLeft } from 'lucide-react';
import AutoplayDemo from './AutoplayDemo';

const DemoMode: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFullScreenDemo, setShowFullScreenDemo] = useState(false);
  
  const demoSteps = [
    {
      title: "Video Upload",
      description: "Upload any video file and our system will automatically extract frames for animation.",
      image: "/placeholder.svg"
    },
    {
      title: "Frame Extraction",
      description: "Advanced frame extraction technology captures the perfect moments from your video.",
      image: "/placeholder.svg"
    },
    {
      title: "Apply Animation Effects",
      description: "Choose from multiple animation effects and customize duration and parameters.",
      image: "/placeholder.svg"
    },
    {
      title: "Audio Integration",
      description: "Add background music or keep original audio from the video for the perfect composition.",
      image: "/placeholder.svg"
    },
    {
      title: "High-Quality Export",
      description: "Export your creation in multiple formats with customizable quality settings.",
      image: "/placeholder.svg"
    }
  ];
  
  // Auto-advance when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < demoSteps.length - 1 ? prev + 1 : 0));
    }, 3000);
    
    return () => clearInterval(timer);
  }, [isPlaying, demoSteps.length]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep > 0 ? currentStep - 1 : demoSteps.length - 1);
  };
  
  const handleNextStep = () => {
    setCurrentStep(currentStep < demoSteps.length - 1 ? currentStep + 1 : 0);
  };
  
  const handleStartFullDemo = () => {
    setShowFullScreenDemo(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Animation Demo</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            className="gap-1"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Play
              </>
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-animation-purple hover:bg-animation-purple/90"
            onClick={handleStartFullDemo}
          >
            <Film className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 relative group">
          <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-lg border border-gray-200">
            <img
              src={demoSteps[currentStep].image}
              alt={demoSteps[currentStep].title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity -ml-4"
              onClick={handlePrevStep}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity -mr-4"
              onClick={handleNextStep}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="md:col-span-5 border-none shadow-none bg-transparent">
          <div className="space-y-6 h-full flex flex-col">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-medium">{demoSteps[currentStep].title}</h3>
                <span className="text-sm text-muted-foreground">
                  {currentStep + 1} / {demoSteps.length}
                </span>
              </div>
              <p className="text-muted-foreground">{demoSteps[currentStep].description}</p>
            </div>
            
            <div className="flex space-x-1">
              {demoSteps.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index === currentStep ? "bg-animation-purple" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentStep(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      {showFullScreenDemo && (
        <AutoplayDemo onClose={() => setShowFullScreenDemo(false)} />
      )}
    </div>
  );
};

export default DemoMode;
