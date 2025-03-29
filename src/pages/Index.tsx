import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  UploadCloud, 
  Play, 
  Download, 
  Layers, 
  Wand2,
  ChevronRight,
  Sparkles,
  Waves,
  RotateCcw,
  MoveVertical
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import StatsCounter from '@/components/StatsCounter';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { scrollToSection, setupScrollAnimations, setupParallaxEffect } from '@/utils/scrollUtils';

const Index = () => {
  const [animateHero, setAnimateHero] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();
  const bgParticlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimateHero(true);
    
    if (location.state && location.state.scrollToId) {
      setTimeout(() => {
        scrollToSection(location.state.scrollToId);
      }, 100);
    }
    
    setupScrollAnimations();
    setupParallaxEffect();
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      if (bgParticlesRef.current) {
        const particles = bgParticlesRef.current.querySelectorAll('.bg-particle');
        particles.forEach((particle, index) => {
          const speed = 0.05 + (index % 3) * 0.03;
          const rotation = window.scrollY * speed;
          const translateY = window.scrollY * speed * 0.5;
          (particle as HTMLElement).style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const createParticles = () => {
      if (!bgParticlesRef.current) return;
      
      while (bgParticlesRef.current.firstChild) {
        bgParticlesRef.current.removeChild(bgParticlesRef.current.firstChild);
      }
      
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('bg-particle');
        
        const size = 5 + Math.random() * 20;
        const opacity = 0.03 + Math.random() * 0.07;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 15 + Math.random() * 30;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.top = `${top}vh`;
        particle.style.left = `${left}vw`;
        particle.style.opacity = opacity.toString();
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        bgParticlesRef.current.appendChild(particle);
      }
    };
    
    createParticles();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  const exampleAnimations = [
    {
      id: 1,
      title: "Fade & Zoom Effects",
      description: "Smooth transitions with fade and zoom effects",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600&h=400",
      icon: <Sparkles className="h-8 w-8 text-white" />
    },
    {
      id: 2,
      title: "Rotation Animation",
      description: "Dynamic rotations for engaging content",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600&h=400",
      icon: <RotateCcw className="h-8 w-8 text-white" />
    },
    {
      id: 3,
      title: "Motion Transitions",
      description: "Directional movements and slide effects",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600&h=400",
      icon: <MoveVertical className="h-8 w-8 text-white" />
    }
  ];

  const features = [
    {
      icon: <UploadCloud className="h-6 w-6 text-animation-purple" />,
      title: "Easy Video Upload",
      description: "Upload your video files with simple drag & drop functionality. Supports MP4, AVI, and MOV formats."
    },
    {
      icon: <Layers className="h-6 w-6 text-animation-purple" />,
      title: "Frame Extraction",
      description: "Automatically extract frames from your video for precise animation editing."
    },
    {
      icon: <Wand2 className="h-6 w-6 text-animation-purple" />,
      title: "Animation Effects",
      description: "Apply professional animation effects like fade, zoom, rotate, and motion transitions."
    },
    {
      icon: <Download className="h-6 w-6 text-animation-purple" />,
      title: "High-Quality Export",
      description: "Export your animations in multiple formats and quality settings for any platform."
    }
  ];

  const tutorialSteps = [
    {
      number: "01",
      title: "Upload Your Video",
      description: "Start by uploading your video file. Drag & drop it into the upload area or click to browse files."
    },
    {
      number: "02",
      title: "Extract Video Frames",
      description: "Extract frames from your video. These frames will become the basis for your animation."
    },
    {
      number: "03",
      title: "Apply Animation Effects",
      description: "Select frames and apply animation effects like fade, zoom, rotate, or movement transitions."
    },
    {
      number: "04",
      title: "Preview & Export",
      description: "Preview your animation to ensure it looks perfect, then export it in your desired format and quality."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      <Navbar />
      
      <div ref={bgParticlesRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden"></div>
      
      <section className="hero-gradient py-20 px-4 md:py-32 overflow-hidden relative z-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-animation-purple/20 animate-pulse-purple"></div>
          <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
          <div className="absolute w-[800px] h-[800px] -top-[400px] -right-[400px] rounded-full bg-animation-purple/40 blur-[120px] animate-spin-slow"></div>
          <div className="absolute w-[600px] h-[600px] -bottom-[300px] -left-[300px] rounded-full bg-animation-purple/30 blur-[100px] animate-spin-slow"></div>
        </div>
        
        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-300 transform ${animateHero ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-text-gradient">
                Transform Videos into Stunning Animations
              </h1>
              <p className="text-white/90 text-lg mb-8">
                Create professional-quality animations from your videos with our powerful web-based editor. No software installation required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/editor">
                  <Button className="w-full sm:w-auto bg-white text-animation-purple hover:bg-white/90 shadow-lg transform transition-transform hover:scale-105 duration-300 animate-pulse-border">
                    Start Editing Now
                    <ChevronRight className="ml-2 h-4 w-4 animate-bounce" />
                  </Button>
                </Link>
                <a href="#tutorial">
                  <Button variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10 transform transition-transform hover:scale-105 duration-300">
                    How It Works
                  </Button>
                </a>
              </div>
            </div>
            <div className={`hidden md:block relative transition-all duration-1000 delay-500 transform ${animateHero ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-2xl overflow-hidden hover:shadow-animation-purple/50 transition-shadow duration-500 animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-animation-purple/30 to-transparent rounded-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=500&h=330" 
                  alt="Animation Editor Preview" 
                  className="rounded-xl transition-transform duration-700 hover:scale-105 relative z-10"
                />
                <div className="absolute inset-0 rounded-xl flex items-center justify-center">
                  <div className="bg-black/30 p-4 rounded-full animate-pulse-purple hover:bg-animation-purple/50 transition-colors duration-300 cursor-pointer">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                
                <div className="absolute top-[20%] -right-10 w-14 h-14 bg-animation-purple/80 backdrop-blur-md rounded-lg animate-float stagger-1 flex items-center justify-center">
                  <Wand2 className="text-white h-8 w-8" />
                </div>
                
                <div className="absolute bottom-[15%] -left-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full animate-float stagger-2 flex items-center justify-center">
                  <Layers className="text-animation-purple h-6 w-6" />
                </div>
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 transform -rotate-12 bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-xl animate-float-slow">
                <div className="absolute inset-0 bg-gradient-to-tr from-animation-purple/20 to-transparent rounded-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=300&h=200" 
                  alt="Animation Effect" 
                  className="rounded-xl"
                />
              </div>
              
              <svg className="absolute -top-10 -right-10 w-32 h-32 text-animation-purple/30 animate-pulse" viewBox="0 0 100 100">
                <path d="M10,30 Q50,10 80,50 T90,90" fill="none" stroke="currentColor" strokeWidth="2" className="animate-draw-path" />
              </svg>
              
              <svg className="absolute -bottom-5 -left-10 w-24 h-24 text-animation-purple/20 animate-pulse" viewBox="0 0 100 100">
                <path d="M10,80 Q30,50 60,70 T90,20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-draw-path-reverse" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-white">
            <path fill="currentColor" fillOpacity="1" d="M0,128L48,133.3C96,139,192,149,288,144C384,139,480,117,576,122.7C672,128,768,160,864,165.3C960,171,1056,149,1152,128C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      <StatsCounter />
      
      <section className="py-16 px-4 bg-white relative z-10">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 animate-on-scroll animate-slide-up" data-delay="100">Animation Examples</h2>
            <p className="text-animation-gray-500 max-w-2xl mx-auto animate-on-scroll animate-slide-up" data-delay="200">
              Transform ordinary videos into eye-catching animations with our powerful editor. Here are some examples of what you can create.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exampleAnimations.map((animation, index) => (
              <div 
                key={animation.id} 
                className="animation-card group transform transition-all duration-300 hover:scale-105 hover:-rotate-1 hover:shadow-xl animate-on-scroll animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
                data-delay={index * 150}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={animation.image} 
                    alt={animation.title} 
                    className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-semibold mb-2 group-hover:text-animation-purple transition-colors">{animation.title}</h3>
                      <p className="text-white/80 text-sm">{animation.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <div className="bg-animation-purple/80 p-3 rounded-full">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                    {animation.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-on-scroll animate-slide-up" data-delay="500">
            <Link to="/editor">
              <Button className="bg-animation-purple hover:bg-animation-purple/90 transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group">
                <span className="relative z-10">Create Your Own Animation</span>
                <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <Zap className="ml-2 h-4 w-4 animate-pulse relative z-10" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section id="features" className="py-16 px-4 bg-animation-gray-100 scroll-mt-20 relative z-10">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 animate-on-scroll animate-slide-up" data-delay="100">Powerful Animation Features</h2>
            <p className="text-animation-gray-500 max-w-2xl mx-auto animate-on-scroll animate-slide-up" data-delay="200">
              Everything you need to create professional animations from your videos, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card transform transition-all duration-500 hover:scale-105 hover:shadow-md hover:bg-white/80 animate-on-scroll animate-slide-up"
                data-delay={200 + (index * 100)}
              >
                <div className="mb-4 transform transition-all duration-500 hover:scale-110 hover:rotate-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-animation-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-animation-purple/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-animation-purple/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </section>
      
      <Testimonials />
      
      <section id="tutorial" className="py-16 px-4 bg-white scroll-mt-20 relative z-10">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 animate-on-scroll animate-slide-up" data-delay="100">How It Works</h2>
            <p className="text-animation-gray-500 max-w-2xl mx-auto animate-on-scroll animate-slide-up" data-delay="200">
              Creating animations from your videos is simple with our easy-to-use editor. Just follow these steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tutorialSteps.map((step, index) => (
              <div 
                key={index} 
                className="relative transform transition-all duration-300 hover:translate-y-[-8px] animate-on-scroll animate-slide-up"
                data-delay={300 + (index * 150)}
              >
                <div className="text-3xl font-bold text-animation-purple/20 mb-2 transform transition-all duration-300 group-hover:scale-110">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-animation-gray-500">{step.description}</p>
                {index < tutorialSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-12 h-0.5 bg-animation-purple/20 -translate-x-6"></div>
                )}
                
                <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full flex items-center justify-center bg-animation-purple text-white font-bold text-lg animate-pulse-border">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-on-scroll animate-slide-up" data-delay="800">
            <Link to="/editor">
              <Button className="bg-animation-purple hover:bg-animation-purple/90 transform transition-all duration-300 hover:scale-105 hover:shadow-lg group relative overflow-hidden">
                <span className="relative z-10">Try It Yourself</span>
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <ChevronRight className="ml-2 h-4 w-4 animate-bounce relative z-10" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-animation-purple via-animation-purple/90 to-animation-purple/80 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-white/5 blur-2xl"></div>
          
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)"></rect>
          </svg>
          
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/30 rounded-full"
              style={{
                width: 4 + Math.random() * 8 + 'px',
                height: 4 + Math.random() * 8 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: 0.1 + Math.random() * 0.3,
                animationDuration: 10 + Math.random() * 20 + 's',
                animationDelay: Math.random() * 5 + 's',
                filter: 'blur(' + Math.random() * 2 + 'px)'
              }}
            ></div>
          ))}
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-sm rounded-xl p-8 md:p-12 shadow-2xl overflow-hidden relative border border-white/10">
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 animate-on-scroll animate-slide-up" data-delay="100">
                  Ready to <span className="relative z-10">Transform Your Videos?
                    <span className="absolute bottom-2 left-0 w-full h-2 bg-white/20 -z-10 transform origin-left"></span>
                  </span>
                </h2>
                
                <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-on-scroll animate-slide-up" data-delay="200">
                  Join thousands of creators who use our platform to bring their videos to life with stunning animations and effects.
                </p>
                
                <div className="flex flex-wrap gap-6 justify-center animate-on-scroll animate-slide-up" data-delay="300">
                  <Link to="/editor">
                    <Button className="bg-white text-animation-purple hover:bg-white/90 text-lg py-6 px-10 shadow-xl border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
                      <span className="relative z-10">Start Creating Now</span>
                      <span className="absolute inset-0 bg-animation-purple/10 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom"></span>
                      <ChevronRight className="ml-2 h-5 w-5 animate-bounce relative z-10" />
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-8 justify-center text-white/80 animate-on-scroll animate-slide-up" data-delay="400">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>No credit card required</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>Free starter plan available</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <ScrollToTopButton />
      <Footer />
    </div>
  );
};

export default Index;
