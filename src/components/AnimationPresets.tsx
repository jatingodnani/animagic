
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Sparkles, ZoomIn, Heart, RotateCw, MoveHorizontal, Droplets, Palette } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface PresetType {
  id: string;
  name: string;
  type: string;
  intensity: number;
  direction?: string;
  duration: number;
  color?: string;
  description: string;
}

interface AnimationPresetsProps {
  onSelectPreset: (preset: PresetType) => void;
  onClose: () => void;
}

const presets: PresetType[] = [
  {
    id: 'smooth-fade-in',
    name: 'Smooth Fade In',
    type: 'fade',
    intensity: 60,
    direction: 'in',
    duration: 3,
    description: 'Gently fades in your image'
  },
  {
    id: 'dramatic-fade-out',
    name: 'Dramatic Fade Out',
    type: 'fade',
    intensity: 75,
    direction: 'out',
    duration: 4,
    description: 'Dramatically fades out your image'
  },
  {
    id: 'quick-zoom',
    name: 'Quick Zoom',
    type: 'zoom',
    intensity: 80,
    direction: 'in',
    duration: 2,
    description: 'Rapidly zooms in on your image'
  },
  {
    id: 'slow-rotate',
    name: 'Slow Rotate',
    type: 'rotate',
    intensity: 40,
    direction: 'clockwise',
    duration: 6,
    description: 'Slowly rotates your image clockwise'
  },
  {
    id: 'bounce-move',
    name: 'Bounce Move',
    type: 'move',
    intensity: 70,
    direction: 'right',
    duration: 3,
    description: 'Moves your image to the right with bounce effect'
  },
  {
    id: 'dreamy-blur',
    name: 'Dreamy Blur',
    type: 'blur',
    intensity: 65,
    duration: 4,
    description: 'Creates a dreamy blur effect on your image'
  },
  {
    id: 'warm-overlay',
    name: 'Warm Overlay',
    type: 'color',
    intensity: 50,
    color: '#ff9d00',
    duration: 3,
    description: 'Adds a warm orange glow to your image'
  },
  {
    id: 'cool-overlay',
    name: 'Cool Overlay',
    type: 'color',
    intensity: 45,
    color: '#0088ff',
    duration: 3,
    description: 'Adds a cool blue tone to your image'
  },
  {
    id: 'gentle-sparkle',
    name: 'Gentle Sparkle',
    type: 'sparkle',
    intensity: 55,
    duration: 5,
    description: 'Adds subtle sparkling effects across your image'
  },
  {
    id: 'cinematic-intro',
    name: 'Cinematic Intro',
    type: 'fade',
    intensity: 90,
    direction: 'in',
    duration: 5,
    description: 'Create a dramatic cinematic introduction'
  },
  {
    id: 'quick-pulse',
    name: 'Quick Pulse',
    type: 'zoom',
    intensity: 50,
    direction: 'in',
    duration: 1,
    description: 'Quick pulsing zoom effect'
  },
  {
    id: 'spiral-rotate',
    name: 'Spiral Rotate',
    type: 'rotate',
    intensity: 90,
    direction: 'clockwise',
    duration: 4,
    description: 'Rotating spiral effect'
  }
];

const getIconForPreset = (preset: PresetType) => {
  switch (preset.type) {
    case 'fade':
      return <Heart className="h-4 w-4" />;
    case 'zoom':
      return <ZoomIn className="h-4 w-4" />;
    case 'rotate':
      return <RotateCw className="h-4 w-4" />;
    case 'move':
      return <MoveHorizontal className="h-4 w-4" />;
    case 'blur':
      return <Droplets className="h-4 w-4" />;
    case 'color':
      return <Palette className="h-4 w-4" />;
    case 'sparkle':
      return <Sparkles className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
};

const AnimationPresets: React.FC<AnimationPresetsProps> = ({ onSelectPreset, onClose }) => {
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-animation-purple" />
          Animation Presets
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {presets.map((preset) => (
          <Card 
            key={preset.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => onSelectPreset(preset)}
          >
            <CardContent className="p-3">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  {getIconForPreset(preset)}
                  <span className="font-medium truncate">{preset.name}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{preset.description}</p>
                <div className="mt-1 text-xs text-animation-gray-500">
                  {preset.duration}s • {preset.intensity}% intensity
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground mt-2">
        Select a preset to quickly apply pre-configured effects to your animation
      </p>
    </div>
  );
};

export default AnimationPresets;
