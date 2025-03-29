
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, Info, ArrowLeft } from 'lucide-react';
import { Presentation as PresentationIcon } from 'lucide-react';
import PerformanceMetrics from '@/components/presentation/PerformanceMetrics';
import FeaturesOverview from '@/components/presentation/FeaturesOverview';
import DemoMode from '@/components/presentation/DemoMode';

const Presentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("demo");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link to="/editor" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-2xl font-semibold">Presentation Mode</h1>
            </div>
            
            <Link to="/editor">
              <Button variant="outline" size="sm">
                Back to Editor
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="col-span-1 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PresentationIcon className="h-5 w-5 text-animation-purple" />
                  Demo Mode
                </CardTitle>
                <CardDescription>Show your project in action</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between"
                  onClick={() => setActiveTab("demo")}
                >
                  View <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="col-span-1 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-animation-purple" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Show processing capabilities</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between"
                  onClick={() => setActiveTab("metrics")}
                >
                  View <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="col-span-1 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-animation-purple" />
                  Features Overview
                </CardTitle>
                <CardDescription>Summarize your project</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between"
                  onClick={() => setActiveTab("features")}
                >
                  View <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="demo">Demo Mode</TabsTrigger>
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
              <TabsTrigger value="features">Features Overview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="space-y-4">
              <DemoMode />
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <PerformanceMetrics />
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <FeaturesOverview />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Presentation;
