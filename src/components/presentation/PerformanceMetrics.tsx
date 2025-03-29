
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceMetrics: React.FC = () => {
  // Sample data - in a real app, you'd collect this data from actual usage
  const frameExtractionData = [
    { name: '240p', time: 1.2, frames: 30 },
    { name: '360p', time: 1.8, frames: 30 },
    { name: '480p', time: 2.5, frames: 30 },
    { name: '720p', time: 4.2, frames: 30 },
    { name: '1080p', time: 7.5, frames: 30 },
    { name: '1440p', time: 12.1, frames: 30 },
    { name: '4K', time: 22.3, frames: 30 },
  ];
  
  const exportTimeData = [
    { name: '5s', gif: 3.2, mp4: 1.8, webm: 2.1 },
    { name: '10s', gif: 5.9, mp4: 3.2, webm: 3.8 },
    { name: '15s', gif: 8.7, mp4: 4.5, webm: 5.2 },
    { name: '30s', gif: 16.1, mp4: 7.8, webm: 9.3 },
    { name: '60s', gif: 30.5, mp4: 14.2, webm: 17.1 },
  ];
  
  const memoryUsageData = [
    { name: 'Frame Extraction', usage: 180 },
    { name: 'Effect Preview', usage: 220 },
    { name: 'Animation Rendering', usage: 350 },
    { name: 'Audio Processing', usage: 120 },
    { name: 'Video Export', usage: 420 },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8s</div>
            <p className="text-sm text-muted-foreground">per 10-second video</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Frame Extraction Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24 fps</div>
            <p className="text-sm text-muted-foreground">frames per second</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Export Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">82%</div>
            <p className="text-sm text-muted-foreground">size reduction with compression</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Frame Extraction Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={frameExtractionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="time" name="Time (seconds)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Export Time by Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={exportTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="gif" name="GIF (seconds)" stroke="#8884d8" />
                  <Line type="monotone" dataKey="mp4" name="MP4 (seconds)" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="webm" name="WebM (seconds)" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Memory Usage by Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={memoryUsageData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" name="Memory Usage (MB)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
