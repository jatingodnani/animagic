
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Play, Film, Download, Volume2, Settings, Gift } from 'lucide-react';

const FeaturesOverview: React.FC = () => {
  const keyFeatures = [
    {
      icon: <Layers className="h-6 w-6 text-animation-purple" />,
      title: "Intelligent Frame Extraction",
      description: "Our algorithm intelligently extracts the most relevant frames from your video, ensuring smooth animations while optimizing for file size and performance."
    },
    {
      icon: <Play className="h-6 w-6 text-animation-purple" />,
      title: "Real-time Animation Preview",
      description: "See your animations in real-time as you adjust settings, allowing for quick iterations and fine-tuning of your creative vision."
    },
    {
      icon: <Film className="h-6 w-6 text-animation-purple" />,
      title: "Multiple Animation Effects",
      description: "Choose from a variety of animation effects including zoom, fade, pan, rotate, and more to bring your videos to life."
    },
    {
      icon: <Volume2 className="h-6 w-6 text-animation-purple" />,
      title: "Audio Integration",
      description: "Easily add background music or maintain the original audio from your video, with precise volume control for the perfect balance."
    },
    {
      icon: <Settings className="h-6 w-6 text-animation-purple" />,
      title: "Advanced Export Options",
      description: "Customize your export with fine-grained control over quality, format, resolution, and compression to meet your specific needs."
    },
    {
      icon: <Download className="h-6 w-6 text-animation-purple" />,
      title: "Multiple Export Formats",
      description: "Export your animations in various formats including GIF, MP4, and WebM, optimized for different platforms and use cases."
    }
  ];
  
  const technicalHighlights = [
    "Built with React and TypeScript for robust, type-safe code",
    "Efficient frame extraction using canvas technology",
    "Optimized memory usage for handling large videos",
    "Browser-based processing with no server dependencies",
    "Real-time visual feedback during all processing steps",
    "Clean, maintainable codebase with modular architecture"
  ];
  
  return (
    <div className="space-y-8 pb-8">
      <div className="text-center space-y-4 bg-gradient-to-r from-animation-purple/10 to-blue-500/10 py-10 px-4 rounded-xl">
        <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-2">
          <Gift className="h-8 w-8 text-animation-purple" />
        </div>
        <h1 className="text-3xl font-bold">AniMagic</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A powerful web-based video animation platform that transforms ordinary videos into captivating animations with just a few clicks.
        </p>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-6">Technical Highlights</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technicalHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Why AniMagic?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Accessible</h3>
            <p className="text-muted-foreground">
              No software installation required. Works in any modern browser, bringing professional animation tools to everyone.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Efficient</h3>
            <p className="text-muted-foreground">
              Optimized for speed and performance, allowing you to create animations faster than traditional video editing software.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Versatile</h3>
            <p className="text-muted-foreground">
              Suitable for social media content, presentations, marketing materials, educational resources, and more.
            </p>
          </div>
        </div>
      </div>
      
      <Card className="bg-animation-purple text-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-medium">Ready for Your Consideration</h2>
            <p>
              Thank you for considering AniMagic for your hackathon evaluation. We believe our solution provides a unique approach to video animation in the browser.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesOverview;
