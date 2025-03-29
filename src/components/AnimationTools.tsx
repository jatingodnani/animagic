
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Slider, 
} from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  RotateCw, 
  ZoomIn, 
  Heart, 
  MoveHorizontal, 
  Wand2, 
  Play,
  Pause,
  Droplets,
  Palette,
  Sparkles,
  SaveIcon
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AnimationPresets, { PresetType } from "./AnimationPresets";

interface AnimationToolsProps {
  selectedFrame: number;
  totalFrames: number;
  onApplyEffect: (effect: AnimationEffect, frameRange: [number, number], duration: number) => void;
  onPreviewEffect: (effect: AnimationEffect | null, duration?: number) => void;
}

export interface AnimationEffect {
  type: 'fade' | 'zoom' | 'rotate' | 'move' | 'blur' | 'color' | 'sparkle';
  intensity: number;
  direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  color?: string; // For color effects
  keyframes?: {
    position: number; // 0-100 percent of duration
    intensity: number;
  }[];
}

const AnimationTools: React.FC<AnimationToolsProps> = ({ 
  selectedFrame, 
  totalFrames,
  onApplyEffect,
  onPreviewEffect
}) => {
  const [effect, setEffect] = useState<AnimationEffect>({
    type: 'fade',
    intensity: 50,
    direction: 'in'
  });
  const [frameRange, setFrameRange] = useState<[number, number]>([selectedFrame, selectedFrame]);
  const [applyToAllFrames, setApplyToAllFrames] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [duration, setDuration] = useState(5); // Default 5 seconds
  const [showPresets, setShowPresets] = useState(false);
  const [colorValue, setColorValue] = useState("#ff5555");
  const { toast } = useToast();
  
  useEffect(() => {
    if (!applyToAllFrames) {
      setFrameRange([selectedFrame, selectedFrame]);
    }
  }, [selectedFrame, applyToAllFrames]);
  
  useEffect(() => {
    if (applyToAllFrames) {
      setFrameRange([0, totalFrames - 1]);
    } else {
      setFrameRange([selectedFrame, selectedFrame]);
    }
  }, [applyToAllFrames, selectedFrame, totalFrames]);
  
  useEffect(() => {
    return () => {
      onPreviewEffect(null);
    };
  }, [onPreviewEffect]);
  
  const handleEffectTypeChange = (type: string) => {
    let newDirection: AnimationEffect['direction'];
    let newEffect: AnimationEffect;
    
    switch (type) {
      case 'fade':
        newDirection = 'in';
        newEffect = {
          type: type as AnimationEffect['type'],
          intensity: effect.intensity,
          direction: newDirection
        };
        break;
      case 'zoom':
        newDirection = 'in';
        newEffect = {
          type: type as AnimationEffect['type'],
          intensity: effect.intensity,
          direction: newDirection
        };
        break;
      case 'rotate':
        newDirection = 'clockwise';
        newEffect = {
          type: type as AnimationEffect['type'],
          intensity: effect.intensity,
          direction: newDirection
        };
        break;
      case 'move':
        newDirection = 'right';
        newEffect = {
          type: type as AnimationEffect['type'],
          intensity: effect.intensity,
          direction: newDirection
        };
        break;
      case 'blur':
        newEffect = {
          type: type as AnimationEffect['type'],
          intensity: effect.intensity,
        };
        break;
      case 'color':
        newEffect = {
          type: type as AnimationEffect['type'],
          intensity: effect.intensity,
          color: colorValue
        };
        break;
      case 'sparkle':
        newEffect = {
          type: type as AnimationEffect['type'],
          intensity: effect.intensity,
        };
        break;
      default:
        newDirection = 'in';
        newEffect = {
          type: type as AnimationEffect['type'],
          intensity: effect.intensity,
          direction: newDirection
        };
    }
    
    setEffect(newEffect);
    
    if (isPreviewing) {
      onPreviewEffect(newEffect, duration);
    }
  };
  
  const handleDirectionChange = (direction: string) => {
    const newEffect = {
      ...effect,
      direction: direction as AnimationEffect['direction']
    };
    
    setEffect(newEffect);
    
    if (isPreviewing) {
      onPreviewEffect(newEffect, duration);
    }
  };
  
  const handleIntensityChange = (value: number[]) => {
    const newEffect = {
      ...effect,
      intensity: value[0]
    };
    
    setEffect(newEffect);
    
    if (isPreviewing) {
      onPreviewEffect(newEffect, duration);
    }
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = Math.max(1, parseInt(e.target.value) || 1);
    setDuration(newDuration);
    
    if (isPreviewing) {
      onPreviewEffect(effect, newDuration);
    }
  };
  
  const handleApply = () => {
    onApplyEffect(effect, frameRange, duration);
    setIsPreviewing(true);
  };
  
  const handlePreviewToggle = () => {
    if (isPreviewing) {
      onPreviewEffect(null);
      setIsPreviewing(false);
    } else {
      onPreviewEffect(effect, duration);
      setIsPreviewing(true);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorValue(e.target.value);
    
    if (effect.type === 'color') {
      const newEffect = {
        ...effect,
        color: e.target.value
      };
      
      setEffect(newEffect);
      
      if (isPreviewing) {
        onPreviewEffect(newEffect, duration);
      }
    }
  };
  
  const handlePresetSelect = (preset: PresetType) => {
    // Apply preset settings
    const newEffect: AnimationEffect = {
      type: preset.type as AnimationEffect['type'],
      intensity: preset.intensity,
      direction: preset.direction as AnimationEffect['direction'],
      color: preset.color
    };
    
    setEffect(newEffect);
    setDuration(preset.duration);
    
    // Preview the preset
    onPreviewEffect(newEffect, preset.duration);
    setIsPreviewing(true);
    
    // Notify user
    toast({
      title: "Preset Applied",
      description: `Applied "${preset.name}" preset effect`,
    });
    
    setShowPresets(false);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Animation Effects</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1"
            onClick={handlePreviewToggle}
          >
            {isPreviewing ? (
              <>
                <Pause className="h-4 w-4" />
                Stop Preview
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Preview
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setShowPresets(!showPresets)}
          >
            <Sparkles className="h-4 w-4" />
            Presets
          </Button>
          <Button 
            size="sm"
            className="bg-animation-purple hover:bg-animation-purple/90 gap-1"
            onClick={handleApply}
          >
            <Wand2 className="h-4 w-4" />
            Apply
          </Button>
        </div>
      </div>
      
      {showPresets ? (
        <AnimationPresets onSelectPreset={handlePresetSelect} onClose={() => setShowPresets(false)} />
      ) : (
        <>
          <Tabs defaultValue="fade" onValueChange={handleEffectTypeChange}>
            <TabsList className="grid grid-cols-7 mb-4">
              <TabsTrigger value="fade" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Fade</span>
              </TabsTrigger>
              <TabsTrigger value="zoom" className="flex items-center gap-1">
                <ZoomIn className="h-4 w-4" />
                <span className="hidden sm:inline">Zoom</span>
              </TabsTrigger>
              <TabsTrigger value="rotate" className="flex items-center gap-1">
                <RotateCw className="h-4 w-4" />
                <span className="hidden sm:inline">Rotate</span>
              </TabsTrigger>
              <TabsTrigger value="move" className="flex items-center gap-1">
                <MoveHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Move</span>
              </TabsTrigger>
              <TabsTrigger value="blur" className="flex items-center gap-1">
                <Droplets className="h-4 w-4" />
                <span className="hidden sm:inline">Blur</span>
              </TabsTrigger>
              <TabsTrigger value="color" className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Color</span>
              </TabsTrigger>
              <TabsTrigger value="sparkle" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Sparkle</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fade" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={effect.direction === 'in' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('in')}
                  className={effect.direction === 'in' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Fade In
                </Button>
                <Button 
                  variant={effect.direction === 'out' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('out')}
                  className={effect.direction === 'out' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Fade Out
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="zoom" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={effect.direction === 'in' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('in')}
                  className={effect.direction === 'in' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Zoom In
                </Button>
                <Button 
                  variant={effect.direction === 'out' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('out')}
                  className={effect.direction === 'out' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Zoom Out
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="rotate" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={effect.direction === 'clockwise' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('clockwise')}
                  className={effect.direction === 'clockwise' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Clockwise
                </Button>
                <Button 
                  variant={effect.direction === 'counterclockwise' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('counterclockwise')}
                  className={effect.direction === 'counterclockwise' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Counter-clockwise
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="move" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={effect.direction === 'left' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('left')}
                  className={effect.direction === 'left' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Left
                </Button>
                <Button 
                  variant={effect.direction === 'right' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('right')}
                  className={effect.direction === 'right' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Right
                </Button>
                <Button 
                  variant={effect.direction === 'up' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('up')}
                  className={effect.direction === 'up' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Up
                </Button>
                <Button 
                  variant={effect.direction === 'down' ? 'default' : 'outline'} 
                  onClick={() => handleDirectionChange('down')}
                  className={effect.direction === 'down' ? 'bg-animation-purple hover:bg-animation-purple/90' : ''}
                >
                  Down
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="blur" className="space-y-4">
              <p className="text-sm text-animation-gray-500 mb-2">
                Control the blur intensity applied to your image
              </p>
            </TabsContent>
            
            <TabsContent value="color" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-picker">Select Color Overlay</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-picker"
                    type="color"
                    value={colorValue}
                    onChange={handleColorChange}
                    className="w-16 p-1"
                  />
                  <Input
                    type="text"
                    value={colorValue}
                    onChange={handleColorChange}
                    className="w-28"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sparkle" className="space-y-4">
              <p className="text-sm text-animation-gray-500 mb-2">
                Add a sparkling effect that animates across your image
              </p>
            </TabsContent>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="intensity">Intensity</Label>
                  <span className="text-sm text-animation-gray-500">{effect.intensity}%</span>
                </div>
                <Slider 
                  id="intensity"
                  min={10} 
                  max={100} 
                  step={1} 
                  value={[effect.intensity]} 
                  onValueChange={handleIntensityChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="60"
                  value={duration}
                  onChange={handleDurationChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="apply-all" 
                  checked={applyToAllFrames}
                  onCheckedChange={(checked) => setApplyToAllFrames(checked === true)}
                />
                <Label htmlFor="apply-all" className="text-sm">
                  Apply to all frames
                </Label>
              </div>
              
              {!applyToAllFrames && (
                <p className="text-xs text-animation-gray-500">
                  Effect will be applied to frame {selectedFrame + 1} for {duration} seconds
                </p>
              )}
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AnimationTools;
