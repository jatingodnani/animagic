
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportSettings } from '@/types/video';

interface AdvancedSettingsProps {
  settings: ExportSettings;
  onSettingChange: (key: keyof ExportSettings, value: any) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-4 border-t pt-4 mt-2">
      <h4 className="text-sm font-medium flex items-center">
        Advanced Settings
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>These settings affect the output quality and file size</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h4>
      
      <div className="space-y-2">
        <Label htmlFor="frameRate">Frame Rate (FPS)</Label>
        <Select
          value={settings.frameRate.toString()}
          onValueChange={(value) => onSettingChange('frameRate', parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select frame rate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24">24 fps (Film)</SelectItem>
            <SelectItem value="30">30 fps (Standard)</SelectItem>
            <SelectItem value="60">60 fps (Smooth)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="custom-resolution"
            checked={settings.useCustomResolution}
            onCheckedChange={(checked) => onSettingChange('useCustomResolution', checked === true)}
          />
          <Label htmlFor="custom-resolution">Use custom resolution</Label>
        </div>
        
        {settings.useCustomResolution && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                min="320"
                max="3840"
                step="16"
                value={settings.customWidth}
                onChange={(e) => onSettingChange('customWidth', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                min="240"
                max="2160"
                step="16"
                value={settings.customHeight}
                onChange={(e) => onSettingChange('customHeight', parseInt(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="compression">Compression Level</Label>
          <span className="text-sm text-animation-gray-500">
            {settings.compressionLevel}%
          </span>
        </div>
        <Slider
          id="compression"
          min={10}
          max={100}
          step={1}
          value={[settings.compressionLevel]}
          onValueChange={(value) => onSettingChange('compressionLevel', value[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="watermark"
          checked={settings.includeWatermark}
          onCheckedChange={(checked) => onSettingChange('includeWatermark', checked === true)}
        />
        <Label htmlFor="watermark">
          Include watermark
        </Label>
      </div>
    </div>
  );
};

export default AdvancedSettings;
