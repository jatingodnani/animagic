
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, Film } from 'lucide-react';

interface VideoUploaderProps {
  onVideoLoaded: (file: File, url: string) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoLoaded }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4, AVI, or MOV file.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate upload progress
    setIsUploading(true);
    setVideoFile(file);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        // Create a URL for the video
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
        onVideoLoaded(file, url);
        
        toast({
          title: "Video uploaded successfully",
          description: `${file.name} is ready for editing`,
        });
      }
    }, 100);
  }, [onVideoLoaded, toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov']
    },
    maxFiles: 1,
    disabled: isUploading || !!videoFile
  });
  
  const resetUpload = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-full">
      {!videoFile ? (
        <div 
          {...getRootProps()} 
          className={`drop-area ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-animation-purple mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload your video</h3>
          <p className="text-sm text-animation-gray-500 text-center mb-4">
            Drag & drop your video file here, or click to browse
          </p>
          <p className="text-xs text-animation-gray-400 text-center">
            Supports MP4, AVI, MOV up to 500MB
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {isUploading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Film className="h-8 w-8 text-animation-purple" />
                  <div>
                    <h4 className="font-medium truncate max-w-[200px]">{videoFile.name}</h4>
                    <p className="text-xs text-animation-gray-500">
                      {Math.round(videoFile.size / 1024 / 1024 * 10) / 10} MB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={resetUpload}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Film className="h-8 w-8 text-animation-purple" />
                  <div>
                    <h4 className="font-medium truncate max-w-[200px]">{videoFile.name}</h4>
                    <p className="text-xs text-animation-gray-500">
                      Ready for editing
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8" 
                  onClick={resetUpload}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {videoPreview && (
                <div className="rounded-lg overflow-hidden bg-black aspect-video">
                  <video 
                    src={videoPreview} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
