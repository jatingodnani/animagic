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
import { 
  RotateCw, 
  ZoomIn, 
  Heart, 
  MoveHorizontal, 
  Wand2, 
  Play 
} from 'lucide-react';

interface AnimationToolsProps {
  selectedFrame: number;
  totalFrames: number;
  onApplyEffect: (effect: AnimationEffect, frameRange: [number, number]) => void;
  onPreviewEffect: (effect: AnimationEffect | null) => void;
}

export interface AnimationEffect {
  type: 'fade' | 'zoom' | 'rotate' | 'move';
  intensity: number;
  direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
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
  
  // Update frame range when selected frame changes
  useEffect(() => {
    if (!applyToAllFrames) {
      setFrameRange([selectedFrame, selectedFrame]);
    }
  }, [selectedFrame, applyToAllFrames]);
  
  // Update frame range when "apply to all frames" changes
  useEffect(() => {
    if (applyToAllFrames) {
      setFrameRange([0, totalFrames - 1]);
    } else {
      setFrameRange([selectedFrame, selectedFrame]);
    }
  }, [applyToAllFrames, selectedFrame, totalFrames]);
  
  const handleEffectTypeChange = (type: string) => {
    let newDirection = effect.direction;
    
    // Set default direction for each effect type
    switch (type) {
      case 'fade':
        newDirection = 'in';
        break;
      case 'zoom':
        newDirection = 'in';
        break;
      case 'rotate':
        newDirection = 'clockwise';
        break;
      case 'move':
        newDirection = 'right';
        break;
    }
    
    setEffect({
      ...effect,
      type: type as AnimationEffect['type'],
      direction: newDirection as AnimationEffect['direction']
    });
  };
  
  const handleDirectionChange = (direction: string) => {
    setEffect({
      ...effect,
      direction: direction as AnimationEffect['direction']
    });
  };
  
  const handleIntensityChange = (value: number[]) => {
    setEffect({
      ...effect,
      intensity: value[0]
    });
  };
  
  const handleApply = () => {
    onApplyEffect(effect, frameRange);
  };
  
  const handlePreview = () => {
    onPreviewEffect(effect);
  };
  
  const handlePreviewEnd = () => {
    onPreviewEffect(null);
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
            onMouseDown={handlePreview}
            onMouseUp={handlePreviewEnd}
            onMouseLeave={handlePreviewEnd}
          >
            <Play className="h-4 w-4" />
            Preview
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
      
      <Tabs defaultValue="fade" onValueChange={handleEffectTypeChange}>
        <TabsList className="grid grid-cols-4 mb-4">
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
              Effect will be applied to frame {selectedFrame + 1}
            </p>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default AnimationTools;
