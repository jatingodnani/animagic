
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, Info, ArrowLeft, Presentation as PresentationIcon } from 'lucide-react';
import PerformanceMetrics from '@/components/presentation/PerformanceMetrics';
import FeaturesOverview from '@/components/presentation/FeaturesOverview';
import DemoMode from '@/components/presentation/DemoMode';
import AnimatedBackground from '@/components/animation/AnimatedBackground';
import FloatingShapes from '@/components/animation/FloatingShapes';

const Presentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("demo");

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground className="opacity-30" />
      <FloatingShapes count={8} className="opacity-20" />
      
      <Navbar />
      
      <main className="flex-grow py-8 px-4 relative z-10">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">Presentation Mode</h1>
            </div>
            
            <Link to="/editor">
              <Button 
                className="bg-animation-purple hover:bg-animation-purple/90 text-white"
                size="sm"
              >
                Go to Editor
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${activeTab === "demo" ? "ring-2 ring-animation-purple bg-animation-purple/5" : ""}`}
                onClick={() => setActiveTab("demo")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-full ${activeTab === "demo" ? "bg-animation-purple text-white" : "bg-gray-100"}`}>
                    <PresentationIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Demo Mode</h3>
                    <p className="text-sm text-muted-foreground">Showcase your animations</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${activeTab === "metrics" ? "ring-2 ring-animation-purple bg-animation-purple/5" : ""}`}
                onClick={() => setActiveTab("metrics")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-full ${activeTab === "metrics" ? "bg-animation-purple text-white" : "bg-gray-100"}`}>
                    <Gauge className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Performance</h3>
                    <p className="text-sm text-muted-foreground">View technical metrics</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${activeTab === "features" ? "ring-2 ring-animation-purple bg-animation-purple/5" : ""}`}
                onClick={() => setActiveTab("features")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-full ${activeTab === "features" ? "bg-animation-purple text-white" : "bg-gray-100"}`}>
                    <Info className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Features</h3>
                    <p className="text-sm text-muted-foreground">Explore capabilities</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <TabsContent value="demo" className="space-y-4 mt-0">
                <DemoMode />
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4 mt-0">
                <PerformanceMetrics />
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4 mt-0">
                <FeaturesOverview />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Presentation;
