import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Sparkles, Palette, Film, Download, Wand2 } from 'lucide-react';
import AnimatedBackground from '@/components/animation/AnimatedBackground';
import AnimatedText from '@/components/animation/AnimatedText';
import Perspective3DCard from '@/components/animation/Perspective3DCard';
import FloatingShapes from '@/components/animation/FloatingShapes';
import ParallaxSection from '@/components/animation/ParallaxSection';
import AnimatedCursor from '@/components/animation/AnimatedCursor';
import TypewriterText from '@/components/animation/TypewriterText';
import AnimatedFeatureCard from '@/components/animation/AnimatedFeatureCard';
import { setupScrollAnimations } from '@/utils/scrollUtils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const HomePage = () => {
  // Setup scroll animations when component mounts
  useEffect(() => {
    setupScrollAnimations();
    
    return () => {
      // Clean up any animation observers
    };
  }, []);
  
  const typingTexts = [
    "Create stunning animations",
    "Transform your videos",
    "Add special effects",
    "Share your creations",
    "Unleash your creativity"
  ];

  return (
    <div className="relative min-h-screen">
      {/* Navigation bar */}
      <Navbar />
      
      {/* Background animation */}
      <AnimatedBackground />
      <AnimatedCursor trailCount={5} />
      
      {/* Hero section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <FloatingShapes count={12} />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <AnimatedText
                text="Transform Your Videos With Magical Animations"
                className="text-4xl md:text-6xl font-bold text-animation-gray-800"
                delay={300}
              />
            </div>
            
            <div className="mb-8 text-lg md:text-xl text-animation-gray-600">
              <TypewriterText 
                texts={typingTexts} 
                typingSpeed={80} 
                className="font-medium"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/editor">
                <Button 
                  size="lg" 
                  className="group bg-animation-purple hover:bg-animation-purple/90 text-white px-8"
                >
                  Try Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to="/presentation">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8"
                >
                  Watch Demo
                  <Film className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured preview */}
      <ParallaxSection className="py-20 bg-white" speed={0.1} direction="up">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Perspective3DCard 
              className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl"
              sensitivity={20}
            >
              <img 
                src="/placeholder.svg" 
                alt="AniMagic Editor" 
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Ready to Create?</h3>
                  <Link to="/editor">
                    <Button className="bg-animation-purple hover:bg-animation-purple/90">
                      Open Editor
                    </Button>
                  </Link>
                </div>
              </div>
            </Perspective3DCard>
          </div>
        </div>
      </ParallaxSection>
      
      {/* Features section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-animation-purple/5 relative">
        <FloatingShapes count={8} className="opacity-30" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedText
              text="Powerful Features For Your Creativity"
              className="text-3xl md:text-4xl font-bold mb-4"
              delay={100}
              highlightColor="bg-animation-purple/10"
            />
            <p className="text-animation-gray-600 max-w-2xl mx-auto">
              Our animation platform is packed with powerful tools to help you create stunning animations with just a few clicks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedFeatureCard
              title="Easy Video Upload"
              description="Upload your videos in various formats and start animating them right away."
              icon={Upload}
              delay={0}
              buttonText="Learn More"
            />
            
            <AnimatedFeatureCard
              title="Animation Effects"
              description="Apply various animation effects like fade, zoom, rotate, and move to your videos."
              icon={Sparkles}
              delay={1}
              buttonText="View Effects"
            />
            
            <AnimatedFeatureCard
              title="Color Adjustments"
              description="Change colors, apply overlays, and add special filters to enhance your animations."
              icon={Palette}
              delay={2}
              buttonText="See Examples"
            />
            
            <AnimatedFeatureCard
              title="Presentation Mode"
              description="Present your creations in a professional and interactive way."
              icon={Film}
              delay={3}
              buttonText="Try It Out"
            />
            
            <AnimatedFeatureCard
              title="Animation Presets"
              description="Use our pre-designed animation templates to quickly create stunning effects."
              icon={Wand2}
              delay={4}
              buttonText="Browse Presets"
            />
            
            <AnimatedFeatureCard
              title="Export Options"
              description="Export your animations in various formats and qualities for different platforms."
              icon={Download}
              delay={5}
              buttonText="Export Now"
            />
          </div>
        </div>
      </section>
      
      {/* Tutorial section */}
      <section id="tutorial" className="py-20 bg-white relative">
        <FloatingShapes count={6} className="opacity-20" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <AnimatedText
              text="How It Works"
              className="text-3xl md:text-4xl font-bold mb-4"
              delay={100}
              highlightColor="bg-animation-purple/10"
            />
            <p className="text-animation-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to create stunning animations with AniMagic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-animation-purple text-white flex items-center justify-center font-bold">1</div>
              <AnimatedFeatureCard
                title="Upload Your Video"
                description="Start by uploading the video you want to animate. We support most popular video formats."
                icon={Upload}
                delay={0}
                buttonText="Learn More"
                buttonHref="/editor"
              />
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-animation-purple text-white flex items-center justify-center font-bold">2</div>
              <AnimatedFeatureCard
                title="Apply Animations"
                description="Choose from our library of animations and effects to transform your video."
                icon={Sparkles}
                delay={1}
                buttonText="See Examples"
                buttonHref="/editor"
              />
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-animation-purple text-white flex items-center justify-center font-bold">3</div>
              <AnimatedFeatureCard
                title="Export & Share"
                description="Export your animated video in high quality and share it with the world."
                icon={Download}
                delay={2}
                buttonText="Try Now"
                buttonHref="/editor"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 bg-animation-purple text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedText
              text="Ready to Transform Your Videos?"
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              delay={100}
              highlightColor="bg-white/20"
            />
            
            <p className="text-white/80 mb-8 text-lg">
              Join thousands of creators who use AniMagic to bring their videos to life with stunning animations.
            </p>
            
            <Link to="/editor">
              <Button 
                size="lg" 
                className="bg-white text-animation-purple hover:bg-white/90 px-8"
              >
                Start Creating Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
