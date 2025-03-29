
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipForward } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const DemoMode: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
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
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Guided Demo</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Auto-Play
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextStep}
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Next
          </Button>
        </div>
      </div>
      
      <Alert>
        <AlertDescription>
          This guided demo shows the key features of AniMagic, our video animation platform. Use the controls to navigate through the demo or let it play automatically.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={demoSteps[currentStep].image}
            alt={demoSteps[currentStep].title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-medium">{demoSteps[currentStep].title}</h3>
                  <span className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {demoSteps.length}
                  </span>
                </div>
                <p className="text-muted-foreground">{demoSteps[currentStep].description}</p>
              </div>
              
              <div className="flex space-x-1">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full ${
                      index === currentStep ? "bg-animation-purple" : "bg-gray-200"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoMode;
