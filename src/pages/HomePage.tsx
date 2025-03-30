import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Sparkles, Palette, Film, Download, Wand2, Play, Pause, RotateCw, ZoomIn, MoveHorizontal } from 'lucide-react';
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

  // Interactive animation showcase state
  const [activeEffect, setActiveEffect] = useState<string>('fade');
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Effect showcase options
  const effects = [
    { id: 'fade', name: 'Fade Effect', icon: <Sparkles className="h-5 w-5" /> },
    { id: 'zoom', name: 'Zoom Effect', icon: <ZoomIn className="h-5 w-5" /> },
    { id: 'rotate', name: 'Rotation Effect', icon: <RotateCw className="h-5 w-5" /> },
    { id: 'move', name: 'Movement Effect', icon: <MoveHorizontal className="h-5 w-5" /> },
  ];

  // Animation demo image URL
  const demoImageUrl = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <AnimatedBackground />
      <AnimatedCursor trailCount={5} />
      
      <section className="relative py-20 md:py-32 overflow-hidden">
        <FloatingShapes count={12} />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 text-center">
              <AnimatedText
                text="Transform Your Videos With Magical Animations"
                className="text-4xl md:text-6xl font-bold text-animation-gray-800 text-center"
                delay={300}
              />
            </div>
            
            <div className="mb-8 text-lg md:text-xl text-animation-gray-600 text-center">
              <TypewriterText 
                texts={typingTexts} 
                typingSpeed={80} 
                className="font-medium"
              />
            </div>
            
            <div className="button-group">
              <Link to="/editor" className="responsive-button">
                <Button 
                  size="lg" 
                  className="group bg-animation-purple hover:bg-animation-purple/90 text-white px-8"
                >
                  Try Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link to="/presentation" className="responsive-button">
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
      
      {/* New Interactive Animation Demo Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">See Animation Magic in Action</h2>
            <p className="text-animation-gray-600 max-w-2xl mx-auto">
              Try different animation effects interactively and see how they transform content in real-time
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-animation-gray-100 rounded-xl overflow-hidden shadow-md">
              <div className="relative aspect-video overflow-hidden">
                {/* Animation Preview Area */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 
                  ${activeEffect === 'fade' ? 'animate-pulse opacity-0 animate-fade-in-out' : ''}
                  ${activeEffect === 'zoom' ? 'animate-pulse scale-[0.8] animate-zoom-in-out' : ''}
                  ${activeEffect === 'rotate' ? 'animate-pulse animate-rotate-slow' : ''}
                  ${activeEffect === 'move' ? 'animate-pulse animate-move-horizontal' : ''}
                `}>
                  <img 
                    src={demoImageUrl}
                    alt="Animation Demo" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm border-white/40 hover:bg-white/30"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex justify-center">
                <p className="text-animation-gray-600 font-medium">
                  Currently showing: <span className="text-animation-purple">{effects.find(e => e.id === activeEffect)?.name}</span>
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="font-semibold mb-4 text-lg">Choose an Effect</h3>
                <div className="space-y-2">
                  {effects.map((effect) => (
                    <Button 
                      key={effect.id}
                      variant={activeEffect === effect.id ? "default" : "outline"}
                      className={`w-full justify-start text-left ${activeEffect === effect.id ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}`}
                      onClick={() => setActiveEffect(effect.id)}
                    >
                      <div className="mr-2">{effect.icon}</div>
                      {effect.name}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-animation-gray-500 mb-4">
                    These are just a few examples. AniMagic offers dozens of customizable effects.
                  </p>
                  <Link to="/editor">
                    <Button className="w-full bg-animation-purple hover:bg-animation-purple/90">
                      Try All Effects
                      <Wand2 className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
                <div className="bg-black/70 backdrop-blur-sm text-white px-10 py-4 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-2">Ready to Create?</h3>
                  <Link to="/editor">
                    <Button className="bg-animation-purple hover:bg-animation-purple/90 w-full">
                      Open Editor
                    </Button>
                  </Link>
                </div>
              </div>
            </Perspective3DCard>
          </div>
        </div>
      </ParallaxSection>
      
      <section id="features" className="py-20 bg-gradient-to-b from-white to-animation-purple/5 relative">
        <FloatingShapes count={8} className="opacity-30" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <AnimatedText
              text="Powerful Features For Your Creativity"
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              delay={100}
              highlightColor="bg-animation-purple/10"
            />
            <p className="text-animation-gray-600 max-w-2xl mx-auto text-center">
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
      
      <section id="tutorial" className="py-20 bg-white relative">
        <FloatingShapes count={6} className="opacity-20" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center mb-16">
            <AnimatedText
              text="How It Works"
              className="text-3xl md:text-4xl font-bold mb-4 text-center mx-auto"
              delay={100}
              highlightColor="bg-animation-purple/10"
            />
            <p className="text-animation-gray-600 max-w-2xl mx-auto text-center">
              Follow these simple steps to create stunning animations with AniMagic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative pl-10 md:pl-0 md:pt-10">
              <div className="absolute -left-4 top-0 md:left-0 md:-top-4 w-8 h-8 rounded-full bg-animation-purple text-white flex items-center justify-center font-bold">1</div>
              <AnimatedFeatureCard
                title="Upload Your Video"
                description="Start by uploading the video you want to animate. We support most popular video formats."
                icon={Upload}
                delay={0}
                buttonText="Learn More"
                buttonHref="/editor"
              />
            </div>
            
            <div className="relative pl-10 md:pl-0 md:pt-10">
              <div className="absolute -left-4 top-0 md:left-0 md:-top-4 w-8 h-8 rounded-full bg-animation-purple text-white flex items-center justify-center font-bold">2</div>
              <AnimatedFeatureCard
                title="Apply Animations"
                description="Choose from our library of animations and effects to transform your video."
                icon={Sparkles}
                delay={1}
                buttonText="See Examples"
                buttonHref="/editor"
              />
            </div>
            
            <div className="relative pl-10 md:pl-0 md:pt-10">
              <div className="absolute -left-4 top-0 md:left-0 md:-top-4 w-8 h-8 rounded-full bg-animation-purple text-white flex items-center justify-center font-bold">3</div>
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
      
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-animation-purple/90 to-animation-purple/70 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 animate-pulse-slow"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white/5 animate-reverse-spin-slow"></div>
          
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/20 rounded-full animate-float-random"
              style={{
                width: 6 + Math.random() * 12 + 'px',
                height: 6 + Math.random() * 12 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDuration: 15 + Math.random() * 20 + 's',
                animationDelay: Math.random() * 5 + 's',
              }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-lg"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-lg"></div>
              
              <div className="text-center flex flex-col items-center justify-center">
                <AnimatedText
                  text="Ready to Transform Your Videos?"
                  className="text-3xl md:text-4xl font-bold text-white mb-6 text-center"
                  delay={100}
                  highlightColor="bg-white/20"
                />
                
                <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto leading-relaxed text-center">
                  Join thousands of creators who use AniMagic to bring their videos to life with stunning animations. Start creating professional-quality animations today.
                </p>
                
                <div className="button-group">
                  <Link to="/editor" className="responsive-button">
                    <Button 
                      size="lg" 
                      className="relative overflow-hidden group bg-white text-animation-purple hover:bg-white/90 px-10 py-6 shadow-glow"
                    >
                      <span className="relative z-10 text-lg font-medium">Start Creating Now</span>
                      <span className="absolute inset-0 bg-animation-purple/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                      <ArrowRight className="ml-2 h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 text-white/80 text-sm text-center">
                  No credit card required. Start with our free plan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes zoom-in-out {
          0%, 100% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes move-horizontal {
          0%, 100% { transform: translateX(-30px); }
          50% { transform: translateX(30px); }
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 3s infinite;
        }
        
        .animate-zoom-in-out {
          animation: zoom-in-out 3s infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 3s infinite linear;
        }
        
        .animate-move-horizontal {
          animation: move-horizontal 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
