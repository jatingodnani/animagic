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
import { ArrowLeft, Presentation, Sparkles, Wand2, Film, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { previewAnimation } from '@/utils/frameAnimationUtils';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import ParallaxSection from '@/components/animation/ParallaxSection';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col editor-gradient">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <Link to="/" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <motion.h1 
                className="text-2xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Video Animation Editor
              </motion.h1>
            </div>
            
            <Link to="/presentation">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Presentation className="h-4 w-4" />
                  Presentation Mode
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          
          {!videoFile ? (
            <ParallaxSection className="max-w-2xl mx-auto my-12" staggerChildren>
              <div className="mb-8 text-center">
                <motion.h2 
                  className="text-2xl font-semibold mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Get Started
                </motion.h2>
                <motion.p 
                  className="text-animation-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Upload a video to begin creating your animation.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
              >
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl blur-md opacity-30"
                  animate={{ 
                    scale: [1, 1.02, 1],
                    opacity: [0.3, 0.4, 0.3]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <div className="relative bg-white rounded-lg p-1">
                  <VideoUploader onVideoLoaded={handleVideoLoaded} />
                </div>
              </motion.div>
            </ParallaxSection>
          ) : (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <Tabs defaultValue="preview" className="space-y-4">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="original" className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Original Video
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="preview" className="space-y-4">
                      {frames.length > 0 && selectedFrame < frames.length ? (
                        <motion.div 
                          className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-tr from-animation-purple/10 to-transparent"
                            animate={{ 
                              backgroundPosition: ['0% 0%', '100% 100%'],
                            }}
                            transition={{ 
                              duration: 15, 
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                          />
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
                        </motion.div>
                      ) : (
                        <div className="aspect-video bg-animation-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-animation-gray-500">
                            {frames.length === 0 
                              ? "Extract frames to preview them here" 
                              : "No frame selected"}
                          </p>
                        </div>
                      )}
                      
                      <motion.div 
                        className="text-sm text-animation-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {frames.length > 0 && selectedFrame < frames.length ? (
                          <p>
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                            >
                              Viewing frame
                            </motion.span>{" "}
                            <motion.span
                              className="text-animation-purple font-medium"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.9 }}
                            >
                              {selectedFrame + 1}
                            </motion.span>{" "}
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.1 }}
                            >
                              of {frames.length}
                            </motion.span>
                          </p>
                        ) : (
                          <p>No frames available</p>
                        )}
                      </motion.div>
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
                
                <motion.div variants={itemVariants}>
                  <Timeline 
                    frames={frames} 
                    onFrameSelect={handleFrameSelect} 
                  />
                </motion.div>
              </motion.div>
              
              <motion.div className="space-y-6" variants={itemVariants}>
                <ParallaxSection direction="right" speed={0.2}>
                  <FrameExtractor 
                    videoUrl={videoUrl} 
                    onFramesExtracted={handleFramesExtracted} 
                  />
                </ParallaxSection>
                
                {frames.length > 0 && (
                  <ParallaxSection direction="left" speed={0.2}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimationTools 
                        selectedFrame={selectedFrame}
                        totalFrames={frames.length}
                        onApplyEffect={handleApplyEffect}
                        onPreviewEffect={handlePreviewEffect}
                      />
                    </motion.div>
                  </ParallaxSection>
                )}
                
                <ParallaxSection direction="right" speed={0.2}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <VideoExporter 
                      frames={frames} 
                      frameRate={frameRate} 
                    />
                  </motion.div>
                </ParallaxSection>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Editor;
