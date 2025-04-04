
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoUploader from '@/components/VideoUploader';
import FrameExtractor from '@/components/FrameExtractor';
import Timeline from '@/components/Timeline';
import AnimationTools, { AnimationEffect } from '@/components/AnimationTools';
import VideoExporter from '@/components/VideoExporter';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useResponsive } from '@/hooks/use-mobile';
import { ArrowLeft, Presentation, Sparkles, Wand2, Film, Video, PanelLeft, PanelRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { previewAnimation } from '@/utils/frameAnimationUtils';
import { Button } from "@/components/ui/button";

const Editor = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [previewEffect, setPreviewEffect] = useState<AnimationEffect | null>(null);
  const [activeEffects, setActiveEffects] = useState<AnimationEffect[]>([]);
  const [frameRate] = useState(24);
  const [animationDuration, setAnimationDuration] = useState(5);
  const [showSidebar, setShowSidebar] = useState(true);
  const { toast } = useToast();
  const { isMobile, isTablet } = useResponsive();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationCleanupRef = useRef<(() => void) | null>(null);
  
  const handleVideoLoaded = (file: File, url: string) => {
    setVideoFile(file);
    setVideoUrl(url);
    setFrames([]);
  };
  
  const handleFramesExtracted = (extractedFrames: string[]) => {
    setFrames(extractedFrames);
    if (extractedFrames.length > 0) {
      setSelectedFrame(0);
    }
  };
  
  const handleFrameSelect = (index: number) => {
    setSelectedFrame(index);
    
    if (animationCleanupRef.current) {
      animationCleanupRef.current();
      animationCleanupRef.current = null;
    }
    
    if (previewEffect && canvasRef.current && frames[index]) {
      startPreviewAnimation(previewEffect);
    }
  };
  
  const handleApplyEffect = (effect: AnimationEffect, frameRange: [number, number], duration: number) => {
    setAnimationDuration(duration);
    
    // Add effect to active effects array instead of replacing it
    setActiveEffects(prevEffects => {
      // Create a new array with the existing effects plus the new one
      return [...prevEffects, effect];
    });
    
    console.log(`Applying ${effect.type} effect with duration: ${duration}s to frames ${frameRange[0] + 1} to ${frameRange[1] + 1}`);
    
    toast({
      title: "Effect applied",
      description: `Applied ${effect.type} effect to frames ${frameRange[0] + 1} to ${frameRange[1] + 1} for ${duration} seconds`,
    });
    
    stopPreviewAnimation();
    
    handlePreviewEffect(effect, duration);
  };
  
  const handlePreviewEffect = (effect: AnimationEffect | null, duration?: number) => {
    stopPreviewAnimation();
    
    if (duration !== undefined) {
      setAnimationDuration(duration);
    }
    
    setPreviewEffect(effect);
    if (effect && canvasRef.current && frames[selectedFrame]) {
      console.log(`Starting preview with duration: ${duration || animationDuration}s`);
      startPreviewAnimation(effect, duration);
    }
  };
  
  const startPreviewAnimation = (effect: AnimationEffect, duration?: number) => {
    if (!canvasRef.current || !frames[selectedFrame]) return;
    
    try {
      stopPreviewAnimation();
      
      const effectDuration = duration || animationDuration;
      console.log(`Starting animation preview with effect: ${effect.type}, duration: ${effectDuration}s`);
      
      const canvasContainer = canvasRef.current.parentElement;
      if (canvasContainer) {
        const existingImages = canvasContainer.querySelectorAll('img');
        existingImages.forEach(img => img.remove());
      }
      
      animationCleanupRef.current = previewAnimation(
        canvasRef.current,
        frames[selectedFrame],
        effect,
        effectDuration
      );
    } catch (error) {
      console.error("Error starting animation preview:", error);
      toast({
        title: "Preview Error",
        description: "There was an error previewing the animation effect.",
        variant: "destructive"
      });
    }
  };
  
  const stopPreviewAnimation = () => {
    if (animationCleanupRef.current) {
      animationCleanupRef.current();
      animationCleanupRef.current = null;
    }
    setPreviewEffect(null);
  };
  
  useEffect(() => {
    return () => {
      stopPreviewAnimation();
    };
  }, []);

  useEffect(() => {
    // Auto-hide sidebar on mobile and show it on larger screens
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow p-2 sm:p-4 md:py-6 md:px-4 lg:py-8 lg:px-6 overflow-x-hidden">
        <div className="container max-w-full lg:max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-gray-500 hover:text-animation-purple transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
                Video Animation Editor
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {!isMobile && frames.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleSidebar}
                  className="flex items-center gap-1 mr-2"
                >
                  {showSidebar ? <PanelRight className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                  <span className="hidden md:inline">{showSidebar ? "Hide" : "Show"} Tools</span>
                </Button>
              )}
              
              <Link to="/presentation">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Presentation className="h-4 w-4" />
                  <span className="hidden md:inline">Presentation</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {!videoFile ? (
            <div className="max-w-2xl mx-auto my-4 sm:my-6 md:my-8 lg:my-12">
              <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 md:mb-3">
                  Get Started
                </h2>
                <p className="text-gray-500">
                  Upload a video to begin creating your animation.
                </p>
              </div>
              <div className="relative">
                <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200 shadow-sm">
                  <VideoUploader onVideoLoaded={handleVideoLoaded} />
                </div>
              </div>
            </div>
          ) : (
            <div className={`${isTablet ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-3'} gap-3 sm:gap-4 md:gap-6`}>
              <div className={`${!showSidebar && !isTablet ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-3 sm:space-y-4 md:space-y-6`}>
                <div className="bg-white rounded-xl shadow-sm p-2 sm:p-3 md:p-4 border border-gray-100">
                  <Tabs defaultValue="preview" className="space-y-3 sm:space-y-4">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="preview" className="flex items-center gap-1 sm:gap-2">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="original" className="flex items-center gap-1 sm:gap-2">
                        <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                        Original Video
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="preview" className="space-y-3 sm:space-y-4">
                      {frames.length > 0 && selectedFrame < frames.length ? (
                        <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
                          <canvas
                            ref={canvasRef}
                            className="max-h-full max-w-full relative z-10"
                          />
                          {!previewEffect && frames[selectedFrame] && (
                            <img 
                              src={frames[selectedFrame]} 
                              alt={`Frame ${selectedFrame + 1}`}
                              className="max-h-full max-w-full object-contain absolute z-10"
                              onLoad={(e) => {
                                if (canvasRef.current) {
                                  const img = e.target as HTMLImageElement;
                                  canvasRef.current.width = img.naturalWidth;
                                  canvasRef.current.height = img.naturalHeight;
                                  
                                  const ctx = canvasRef.current.getContext('2d');
                                  if (ctx) {
                                    ctx.drawImage(img, 0, 0);
                                  }
                                }
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500 text-sm sm:text-base">
                            {frames.length === 0 
                              ? "Extract frames to preview them here" 
                              : "No frame selected"}
                          </p>
                        </div>
                      )}
                      
                      <div className="text-xs sm:text-sm text-gray-500">
                        {frames.length > 0 && selectedFrame < frames.length ? (
                          <p>
                            Viewing frame {selectedFrame + 1} of {frames.length}
                          </p>
                        ) : (
                          <p>No frames available</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="original">
                      {videoUrl ? (
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <video 
                            src={videoUrl} 
                            controls 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500 text-sm sm:text-base">No video loaded</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="overflow-x-auto">
                  <Timeline 
                    frames={frames} 
                    onFrameSelect={handleFrameSelect} 
                  />
                </div>
              </div>
              
              {(showSidebar || isTablet) && (
                <div className={`space-y-3 sm:space-y-4 md:space-y-6 w-full ${isTablet ? 'mt-4' : ''}`}>
                  <div className="w-full">
                    <FrameExtractor 
                      videoUrl={videoUrl} 
                      onFramesExtracted={handleFramesExtracted} 
                    />
                  </div>
                  
                  {frames.length > 0 && (
                    <div className="w-full">
                      <AnimationTools 
                        selectedFrame={selectedFrame}
                        totalFrames={frames.length}
                        onApplyEffect={handleApplyEffect}
                        onPreviewEffect={handlePreviewEffect}
                      />
                    </div>
                  )}
                  
                  <div className="w-full">
                    <VideoExporter 
                      frames={frames} 
                      frameRate={frameRate}
                      currentEffects={activeEffects}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Editor;
