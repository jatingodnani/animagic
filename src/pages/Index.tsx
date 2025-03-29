
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  UploadCloud, 
  Play, 
  Download, 
  Layers, 
  Wand2,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  // Example animations
  const exampleAnimations = [
    {
      id: 1,
      title: "Fade & Zoom Effects",
      description: "Smooth transitions with fade and zoom effects",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      id: 2,
      title: "Rotation Animation",
      description: "Dynamic rotations for engaging content",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      id: 3,
      title: "Motion Transitions",
      description: "Directional movements and slide effects",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600&h=400"
    }
  ];
  
  // Features
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
  
  // Tutorial steps
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4 md:py-32">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Transform Videos into Stunning Animations
              </h1>
              <p className="text-white/90 text-lg mb-8">
                Create professional-quality animations from your videos with our powerful web-based editor. No software installation required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/editor">
                  <Button className="w-full sm:w-auto bg-white text-animation-purple hover:bg-white/90 shadow-lg">
                    Start Editing Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#tutorial">
                  <Button variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
                    How It Works
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden md:block relative animate-scale-in">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=500&h=330" 
                  alt="Animation Editor Preview" 
                  className="rounded-xl"
                />
                <div className="absolute inset-0 rounded-xl flex items-center justify-center">
                  <div className="bg-black/30 p-4 rounded-full animate-pulse-purple">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 transform -rotate-12 bg-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=300&h=200" 
                  alt="Animation Effect" 
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Example Animations */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Animation Examples</h2>
            <p className="text-animation-gray-500 max-w-2xl mx-auto">
              Transform ordinary videos into eye-catching animations with our powerful editor. Here are some examples of what you can create.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exampleAnimations.map((animation) => (
              <div key={animation.id} className="animation-card group">
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={animation.image} 
                    alt={animation.title} 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-semibold mb-2">{animation.title}</h3>
                      <p className="text-white/80 text-sm">{animation.description}</p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-animation-purple/80 p-3 rounded-full">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/editor">
              <Button className="bg-animation-purple hover:bg-animation-purple/90">
                Create Your Own Animation
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="py-16 px-4 bg-animation-gray-100">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Powerful Animation Features</h2>
            <p className="text-animation-gray-500 max-w-2xl mx-auto">
              Everything you need to create professional animations from your videos, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-animation-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="tutorial" className="py-16 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
            <p className="text-animation-gray-500 max-w-2xl mx-auto">
              Creating animations from your videos is simple with our easy-to-use editor. Just follow these steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tutorialSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-3xl font-bold text-animation-purple/20 mb-2">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-animation-gray-500">{step.description}</p>
                {index < tutorialSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-12 h-0.5 bg-animation-purple/20 -translate-x-6"></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/editor">
              <Button className="bg-animation-purple hover:bg-animation-purple/90">
                Try It Yourself
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 hero-gradient">
        <div className="container max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Create Amazing Animations?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who use our platform to bring their videos to life with stunning animations.
          </p>
          <Link to="/editor">
            <Button className="bg-white text-animation-purple hover:bg-white/90 shadow-lg">
              Start Editing Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
