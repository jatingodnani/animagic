
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { scrollToSection } from '@/utils/scrollUtils';

interface AutoplayDemoProps {
  onClose: () => void;
}

const AutoplayDemo: React.FC<AutoplayDemoProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const demoSlides = [
    {
      title: "Welcome to AniMagic",
      description: "AniMagic is a powerful web-based video animation platform that transforms ordinary videos into captivating animations.",
      image: "https://res.cloudinary.com/dyve1c6cb/image/upload/v1743248006/aonk3lhlrewaq06viaaq.png",
      duration: 5000,
    },
    {
      title: "Upload Your Videos",
      description: "Start by uploading any video file up to 500MB. Our system accepts MP4, AVI, and MOV formats.",
      image: "https://res.cloudinary.com/dyve1c6cb/image/upload/v1743247247/mjilqiovcf6rwzqxjd4i.png",
      duration: 4000,
    },
    {
      title: "Extract Frames",
      description: "Our intelligent frame extraction automatically captures key moments from your video for animation.",
      image: "https://res.cloudinary.com/dyve1c6cb/image/upload/v1743247259/v5mkb4li8494wfdnmnqn.png",
      duration: 4000,
    },
    {
      title: "Apply Animation Effects",
      description: "Choose from a variety of effects including fade, zoom, rotate, move, blur, color overlays, and sparkle effects.",
      image: "https://res.cloudinary.com/dyve1c6cb/image/upload/v1743247232/ezafjpccxlhnnthygiio.png",
      duration: 5000,
    },
    {
      title: "Customize Duration & Intensity",
      description: "Fine-tune your animations with precise control over duration, intensity, and frame selection.",
      image: "https://res.cloudinary.com/dyve1c6cb/image/upload/v1743247232/ezafjpccxlhnnthygiio.png",
      duration: 4000,
    },
    {
      title: "Add Audio",
      description: "Include background music or keep the original audio from your video for the perfect composition.",
      image: "/placeholder.svg",
      duration: 4000,
    },
    {
      title: "Export Options",
      description: "Export your creation in GIF, MP4, or WebM formats with customizable quality settings.",
      image: "https://res.cloudinary.com/dyve1c6cb/image/upload/v1743247222/m5aoubunpvpliifnbqnb.png",
      duration: 4000,
    },
    {
      title: "Start Creating Today",
      description: "Begin your journey with AniMagic and transform ordinary videos into engaging animations with just a few clicks.",
      image: "/placeholder.svg",
      duration: 5000,
    },
  ];

  // Function to update progress bar
  const updateProgress = (slideIndex: number, elapsed: number) => {
    const slideDuration = demoSlides[slideIndex].duration;
    const percentage = Math.min((elapsed / slideDuration) * 100, 100);
    setProgress(percentage);
  };

  // Manage slideshow playback
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    let startTime = Date.now();
    let animationId: number;
    const slideDuration = demoSlides[currentSlide].duration;

    // Progress animation
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      updateProgress(currentSlide, elapsed);
      
      if (elapsed < slideDuration) {
        animationId = requestAnimationFrame(animateProgress);
      }
    };

    animationId = requestAnimationFrame(animateProgress);

    // Move to next slide after duration
    timerRef.current = window.setTimeout(() => {
      if (currentSlide < demoSlides.length - 1) {
        setCurrentSlide(currentSlide + 1);
        setProgress(0);
      } else {
        setIsPlaying(false);
        setProgress(100);
      }
    }, slideDuration);

    return () => {
      window.clearTimeout(timerRef.current!);
      cancelAnimationFrame(animationId);
    };
  }, [currentSlide, isPlaying, demoSlides]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSlide = () => {
    if (currentSlide < demoSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setProgress(0);
    } else {
      setCurrentSlide(0);
      setProgress(0);
    }
  };

  const handleRestart = () => {
    setCurrentSlide(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleLearnMore = (section: string) => {
    onClose();
    scrollToSection(section);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden animate-fade-in">
        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/90 hover:bg-white"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/90 hover:bg-white"
              onClick={handleNextSlide}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/90 hover:bg-white"
              onClick={handleRestart}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/90 hover:bg-white"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
          
          <div className="aspect-video bg-black">
            <img
              src={demoSlides[currentSlide].image}
              alt={demoSlides[currentSlide].title}
              className="w-full h-full object-contain"
            />
          </div>
          
          <Progress 
            value={progress} 
            className="h-1 w-full rounded-none" 
          />
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">{demoSlides[currentSlide].title}</h2>
            <p className="text-muted-foreground">{demoSlides[currentSlide].description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex space-x-1">
              {demoSlides.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-8 rounded-full ${
                    index === currentSlide ? "bg-animation-purple" : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setCurrentSlide(index);
                    setProgress(0);
                  }}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleLearnMore('features')}>
                View Features
              </Button>
              <Button 
                className="bg-animation-purple hover:bg-animation-purple/90"
                onClick={() => window.location.href = '/editor'}
              >
                Try Editor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoplayDemo;
