
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
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { previewAnimation } from '@/utils/frameAnimationUtils';

const Editor = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [previewEffect, setPreviewEffect] = useState<AnimationEffect | null>(null);
  const [frameRate] = useState(24);
  const [animationDuration, setAnimationDuration] = useState(5); // Default 5 seconds
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationCleanupRef = useRef<(() => void) | null>(null);
  
  // Handle video upload
  const handleVideoLoaded = (file: File, url: string) => {
    setVideoFile(file);
    setVideoUrl(url);
    setFrames([]);
  };
  
  // Handle frame extraction
  const handleFramesExtracted = (extractedFrames: string[]) => {
    setFrames(extractedFrames);
    if (extractedFrames.length > 0) {
      setSelectedFrame(0);
    }
  };
  
  // Handle frame selection in timeline
  const handleFrameSelect = (index: number) => {
    setSelectedFrame(index);
    
    // Clear any existing animation when changing frames
    if (animationCleanupRef.current) {
      animationCleanupRef.current();
      animationCleanupRef.current = null;
    }
    
    // If there was an effect being previewed, restart it on the new frame
    if (previewEffect && canvasRef.current && frames[index]) {
      startPreviewAnimation(previewEffect);
    }
  };
  
  // Apply animation effect to frames
  const handleApplyEffect = (effect: AnimationEffect, frameRange: [number, number], duration: number) => {
    // Update the animation duration
    setAnimationDuration(duration);
    
    // In a real implementation, this would actually modify the frames with the effect
    console.log(`Applying ${effect.type} effect with duration: ${duration}s to frames ${frameRange[0] + 1} to ${frameRange[1] + 1}`);
    
    toast({
      title: "Effect applied",
      description: `Applied ${effect.type} effect to frames ${frameRange[0] + 1} to ${frameRange[1] + 1} for ${duration} seconds`,
    });
    
    // Clear preview after applying
    stopPreviewAnimation();
  };
  
  // Preview effect on current frame
  const handlePreviewEffect = (effect: AnimationEffect | null, duration?: number) => {
    // Clear existing animation
    stopPreviewAnimation();
    
    // Update duration if provided
    if (duration !== undefined) {
      setAnimationDuration(duration);
    }
    
    // Set new effect and start preview if needed
    setPreviewEffect(effect);
    if (effect && canvasRef.current && frames[selectedFrame]) {
      console.log(`Starting preview with duration: ${duration || animationDuration}s`);
      startPreviewAnimation(effect, duration);
    }
  };
  
  // Start animation preview
  const startPreviewAnimation = (effect: AnimationEffect, duration?: number) => {
    if (!canvasRef.current || !frames[selectedFrame]) return;
    
    try {
      // Stop any existing animation
      stopPreviewAnimation();
      
      const effectDuration = duration || animationDuration;
      console.log(`Starting animation preview with effect: ${effect.type}, duration: ${effectDuration}s`);
      
      // Start new animation and store cleanup function
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
  
  // Stop animation preview
  const stopPreviewAnimation = () => {
    if (animationCleanupRef.current) {
      animationCleanupRef.current();
      animationCleanupRef.current = null;
    }
  };
  
  // Clean up animations when component unmounts
  useEffect(() => {
    return () => {
      stopPreviewAnimation();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col editor-gradient">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-semibold">Video Animation Editor</h1>
          </div>
          
          {!videoFile ? (
            <div className="max-w-2xl mx-auto my-12">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold mb-3">Get Started</h2>
                <p className="text-animation-gray-500">
                  Upload a video to begin creating your animation.
                </p>
              </div>
              <VideoUploader onVideoLoaded={handleVideoLoaded} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Preview and Tools */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video/Frame Preview */}
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <Tabs defaultValue="preview" className="space-y-4">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="original">Original Video</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="preview" className="space-y-4">
                      {frames.length > 0 && selectedFrame < frames.length ? (
                        <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                          <canvas
                            ref={canvasRef}
                            className="max-h-full max-w-full"
                          />
                          {!previewEffect && frames[selectedFrame] && (
                            <img 
                              src={frames[selectedFrame]} 
                              alt={`Frame ${selectedFrame + 1}`}
                              className="max-h-full max-w-full object-contain absolute"
                              onLoad={(e) => {
                                // Once image loads, set canvas size to match
                                if (canvasRef.current) {
                                  const img = e.target as HTMLImageElement;
                                  canvasRef.current.width = img.naturalWidth;
                                  canvasRef.current.height = img.naturalHeight;
                                  
                                  // Draw initial frame on canvas
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
                        <div className="aspect-video bg-animation-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-animation-gray-500">
                            {frames.length === 0 
                              ? "Extract frames to preview them here" 
                              : "No frame selected"}
                          </p>
                        </div>
                      )}
                      
                      <div className="text-sm text-animation-gray-500">
                        {frames.length > 0 && selectedFrame < frames.length ? (
                          <p>Viewing frame {selectedFrame + 1} of {frames.length}</p>
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
                        <div className="aspect-video bg-animation-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-animation-gray-500">No video loaded</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Timeline */}
                <Timeline 
                  frames={frames} 
                  onFrameSelect={handleFrameSelect} 
                />
              </div>
              
              {/* Right Column: Tools and Export */}
              <div className="space-y-6">
                {/* Frame Extraction */}
                {videoUrl && (
                  <FrameExtractor 
                    videoUrl={videoUrl} 
                    onFramesExtracted={handleFramesExtracted} 
                  />
                )}
                
                {/* Animation Tools */}
                {frames.length > 0 && (
                  <AnimationTools 
                    selectedFrame={selectedFrame}
                    totalFrames={frames.length}
                    onApplyEffect={handleApplyEffect}
                    onPreviewEffect={handlePreviewEffect}
                  />
                )}
                
                {/* Export Options */}
                <VideoExporter 
                  frames={frames} 
                  frameRate={frameRate} 
                />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Editor;
