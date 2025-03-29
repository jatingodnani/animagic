
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getTotalFramesForAnimation, getAvailableFormats } from "@/utils/videoExportUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportSettings } from '@/types/video';

interface BasicSettingsProps {
  settings: ExportSettings;
  onSettingChange: (key: keyof ExportSettings, value: any) => void;
  isMacOS: boolean;
  hasWebCodecSupport: boolean;
}

const BasicSettings: React.FC<BasicSettingsProps> = ({ 
  settings, 
  onSettingChange, 
  isMacOS, 
  hasWebCodecSupport 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 my-4">
      <div className="space-y-2">
        <Label htmlFor="duration">Animation Duration (seconds)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          max="60"
          value={settings.duration}
          onChange={(e) => onSettingChange('duration', e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-animation-gray-500">
          This will create a {getTotalFramesForAnimation(settings)} frame animation at {settings.frameRate} fps
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Quality</label>
          <Select
            value={settings.quality}
            onValueChange={(value) => onSettingChange('quality', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (640x360)</SelectItem>
              <SelectItem value="medium">Medium (720p)</SelectItem>
              <SelectItem value="high">High (1080p)</SelectItem>
              <SelectItem value="ultra">Ultra HD (4K)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <Select
            value={settings.format}
            onValueChange={(value) => onSettingChange('format', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableFormats(isMacOS, hasWebCodecSupport).map(format => (
                <SelectItem key={format} value={format}>
                  {format.toUpperCase()}
                  {format === "gif" && isMacOS && " (Recommended)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isMacOS && settings.format !== "gif" && (
            <p className="text-xs text-amber-500">
              Some Mac devices may have limited support for this format
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicSettings;
