
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Info, Music } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExportSettings } from '@/types/video';

interface AudioSettingsProps {
  settings: ExportSettings;
  onSettingChange: (key: keyof ExportSettings, value: any) => void;
}

const AudioSettings: React.FC<AudioSettingsProps> = ({ settings, onSettingChange }) => {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Check if file is an audio file
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file (.mp3, .wav, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // File size check (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Audio file must be less than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      onSettingChange('audioFile', file);
      onSettingChange('includeAudio', true);
      
      toast({
        title: "Audio added",
        description: `${file.name} will be included in your export`,
      });
    }
  };
  
  const removeAudio = () => {
    onSettingChange('audioFile', null);
    onSettingChange('includeAudio', false);
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
    toast({
      title: "Audio removed",
      description: "Your export will not include audio",
    });
  };

  return (
    <div className="space-y-2 border-t pt-4 mt-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center">
          Audio Settings
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add background music to your animation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h4>
        {settings.format === "gif" && (
          <p className="text-xs text-amber-500">
            GIF format does not support audio
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox
          id="include-audio"
          checked={settings.includeAudio}
          disabled={settings.format === "gif" || !settings.audioFile}
          onCheckedChange={(checked) => onSettingChange('includeAudio', checked === true)}
        />
        <Label htmlFor="include-audio">
          Include audio in export
        </Label>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <div>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioFileChange}
            className="hidden"
            id="audio-file-input"
          />
          
          {settings.audioFile ? (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded border">
              <div className="flex items-center space-x-2">
                <Music className="h-4 w-4 text-animation-purple" />
                <span className="text-sm truncate max-w-[200px]">{settings.audioFile.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={removeAudio}
              >
                Remove
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('audio-file-input')?.click()}
            >
              <Music className="mr-2 h-4 w-4" />
              Add Audio File
            </Button>
          )}
        </div>
        
        {settings.audioFile && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="audio-volume">Audio Volume</Label>
              <span className="text-sm text-animation-gray-500">
                {settings.audioVolume}%
              </span>
            </div>
            <Slider
              id="audio-volume"
              min={0}
              max={100}
              step={5}
              value={[settings.audioVolume]}
              onValueChange={(value) => onSettingChange('audioVolume', value[0])}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioSettings;
