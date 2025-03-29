
import React, { useState, useEffect } from 'react';
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

const Editor = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [previewEffect, setPreviewEffect] = useState<AnimationEffect | null>(null);
  const [frameRate] = useState(24);
  const { toast } = useToast();
  
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
    setPreviewEffect(null);
  };
  
  // Apply animation effect to frames
  const handleApplyEffect = (effect: AnimationEffect, frameRange: [number, number]) => {
    // In a real implementation, this would actually modify the frames with the effect
    // For this demo, we'll just show a toast
    toast({
      title: "Effect applied",
      description: `Applied ${effect.type} effect to frames ${frameRange[0] + 1} to ${frameRange[1] + 1}`,
    });
    setPreviewEffect(null);
  };
  
  // Preview effect on current frame
  const handlePreviewEffect = (effect: AnimationEffect | null) => {
    setPreviewEffect(effect);
  };

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
                          <div className={`relative ${getPreviewClass(previewEffect)}`}>
                            <img 
                              src={frames[selectedFrame]} 
                              alt={`Frame ${selectedFrame + 1}`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
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

// Helper function to get preview class based on the effect
const getPreviewClass = (effect: AnimationEffect | null): string => {
  if (!effect) return "";
  
  switch (effect.type) {
    case "fade":
      return effect.direction === "in" 
        ? "animate-[fade-in_1s_ease-out_infinite]" 
        : "animate-[fade-out_1s_ease-out_infinite]";
      
    case "zoom":
      return effect.direction === "in"
        ? "animate-[scale-in_1s_ease-out_infinite]"
        : "animate-[scale-out_1s_ease-out_infinite]";
      
    case "rotate":
      return effect.direction === "clockwise"
        ? "animate-[spin_2s_linear_infinite]"
        : "animate-[spin_2s_linear_infinite_reverse]";
      
    case "move":
      switch (effect.direction) {
        case "left":
          return "animate-[slide-left_1s_ease-out_infinite]";
        case "right":
          return "animate-[slide-right_1s_ease-out_infinite]";
        case "up":
          return "animate-[slide-up_1s_ease-out_infinite]";
        case "down":
          return "animate-[slide-down_1s_ease-out_infinite]";
        default:
          return "";
      }
      
    default:
      return "";
  }
};

export default Editor;
