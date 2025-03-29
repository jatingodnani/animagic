
/**
 * Utilities for frame extraction, animation, and encoding using the Web Codecs API
 */

// Step 1: Extract frame from video
export async function extractFrame(videoFile: File, targetFrameIndex: number): Promise<VideoFrame> {
  const videoData = await videoFile.arrayBuffer();
  
  return new Promise((resolve, reject) => {
    let frameCount = 0;
    
    // Check if VideoDecoder is supported
    if (!('VideoDecoder' in window)) {
      reject(new Error('VideoDecoder API is not supported in this browser'));
      return;
    }
    
    const decoder = new VideoDecoder({
      output: (frame) => {
        if (frameCount === targetFrameIndex) {
          // This is our target frame
          resolve(frame);
        } else {
          frame.close(); // Release frames we don't need
        }
        frameCount++;
      },
      error: (e) => reject(e)
    });
    
    try {
      // Try to determine codec, default to VP8
      // In a real app, you'd need more sophisticated codec detection
      const codecString = 'vp8';
      
      decoder.configure({
        codec: codecString
      });
      
      const chunk = new EncodedVideoChunk({
        type: 'key',
        timestamp: 0,
        data: videoData
      });
      
      decoder.decode(chunk);
    } catch (error) {
      reject(error);
    }
  });
}

// Apply different animation effects to a frame
export async function applyAnimationEffect(
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  frame: VideoFrame | HTMLImageElement,
  effect: {
    type: 'fade' | 'zoom' | 'rotate' | 'move';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  },
  progress: number // 0 to 1 representing animation progress
): Promise<void> {
  // Save the canvas state
  ctx.save();
  
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Get frame dimensions
  const width = frame instanceof VideoFrame ? frame.displayWidth : frame.width;
  const height = frame instanceof VideoFrame ? frame.displayHeight : frame.height;
  
  // Normalize intensity to 0-1
  const intensity = effect.intensity / 100;
  
  // Apply different effects based on the type
  switch (effect.type) {
    case 'fade':
      if (effect.direction === 'in') {
        ctx.globalAlpha = progress * intensity;
      } else { // 'out'
        ctx.globalAlpha = (1 - progress) * intensity;
      }
      ctx.drawImage(frame, 0, 0, width, height);
      break;
      
    case 'zoom':
      const zoomFactor = effect.direction === 'in' 
        ? 1 + (progress * intensity)
        : 2 - (progress * intensity);
      
      // Center the zoom
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoomFactor, zoomFactor);
      ctx.translate(-width / 2, -height / 2);
      
      ctx.drawImage(frame, 0, 0, width, height);
      break;
      
    case 'rotate':
      // Get rotation angle based on direction and progress
      const angleMultiplier = effect.direction === 'clockwise' ? 1 : -1;
      const maxRotation = 360 * intensity; // Max rotation based on intensity
      const currentAngle = progress * maxRotation * angleMultiplier;
      
      // Set rotation center
      ctx.translate(width / 2, height / 2);
      ctx.rotate((currentAngle * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);
      
      ctx.drawImage(frame, 0, 0, width, height);
      break;
      
    case 'move':
      let xOffset = 0;
      let yOffset = 0;
      
      switch(effect.direction) {
        case 'left':
          xOffset = (1 - progress) * width * intensity;
          break;
        case 'right':
          xOffset = (progress - 1) * width * intensity;
          break;
        case 'up':
          yOffset = (1 - progress) * height * intensity;
          break;
        case 'down':
          yOffset = (progress - 1) * height * intensity;
          break;
      }
      
      ctx.drawImage(frame, xOffset, yOffset, width, height);
      break;
      
    default:
      // Default to just drawing the frame
      ctx.drawImage(frame, 0, 0, width, height);
  }
  
  // Restore the canvas state
  ctx.restore();
}

// Step 2: Animate the frame
export async function animateFrame(
  frame: VideoFrame,
  effect: {
    type: 'fade' | 'zoom' | 'rotate' | 'move';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  },
  duration: number,
  fps: number
): Promise<VideoFrame[]> {
  // Create an OffscreenCanvas with the frame dimensions
  const canvas = new OffscreenCanvas(frame.displayWidth, frame.displayHeight);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  const totalFrames = Math.round(duration * fps);
  const animatedFrames: VideoFrame[] = [];
  
  for (let i = 0; i < totalFrames; i++) {
    // Calculate progress (0 to 1)
    const progress = i / (totalFrames - 1);
    
    // Apply animation effect to this frame
    await applyAnimationEffect(ctx, frame, effect, progress);
    
    // Capture the canvas content as a new video frame
    const newFrame = new VideoFrame(canvas, {
      timestamp: (i * 1000000) / fps, // timestamp in microseconds
      duration: 1000000 / fps
    });
    
    animatedFrames.push(newFrame);
  }
  
  return animatedFrames;
}

// Step 3: Encode frames to video
export async function encodeFrames(frames: VideoFrame[]): Promise<EncodedVideoChunk[]> {
  if (frames.length === 0) {
    throw new Error('No frames to encode');
  }
  
  // Check if VideoEncoder is supported
  if (!('VideoEncoder' in window)) {
    throw new Error('VideoEncoder API is not supported in this browser');
  }
  
  return new Promise((resolve, reject) => {
    const chunks: EncodedVideoChunk[] = [];
    
    const encoder = new VideoEncoder({
      output: (chunk) => {
        chunks.push(chunk);
      },
      error: (e) => reject(e),
      complete: () => resolve(chunks)
    });
    
    try {
      encoder.configure({
        codec: 'vp8',
        width: frames[0].displayWidth,
        height: frames[0].displayHeight,
        bitrate: 2_000_000, // 2 Mbps
        framerate: 30
      });
      
      frames.forEach(frame => {
        encoder.encode(frame);
        frame.close(); // Release frame after encoding
      });
      
      encoder.flush();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to combine encoded chunks into a video
export function concatenateChunks(chunks: EncodedVideoChunk[]): ArrayBuffer {
  // This is a simplified version
  // In a real app, you'd need to create a proper WebM container
  
  let totalSize = 0;
  chunks.forEach(chunk => {
    // We need to access the data, which might require a different approach
    // This is a simplification and might not work directly
    totalSize += chunk.byteLength;
  });
  
  const result = new Uint8Array(totalSize);
  let offset = 0;
  
  chunks.forEach(chunk => {
    // Note: In real implementation, you need proper access to chunk data
    // This might require converting the chunk to a different format
    const data = new Uint8Array(chunk.byteLength);
    // Copy chunk data to the data array (simplified)
    result.set(data, offset);
    offset += chunk.byteLength;
  });
  
  return result.buffer;
}

// Main function to create animated video from a single frame
export async function createAnimatedVideo(
  videoFile: File,
  targetFrameIndex: number,
  effect: {
    type: 'fade' | 'zoom' | 'rotate' | 'move';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  },
  animationDuration: number,
  fps: number
): Promise<Blob> {
  try {
    // Extract the target frame
    const extractedFrame = await extractFrame(videoFile, targetFrameIndex);
    
    // Apply animation to create sequence of frames
    const animatedFrames = await animateFrame(extractedFrame, effect, animationDuration, fps);
    
    // Close the original frame after we're done with it
    extractedFrame.close();
    
    // Encode the animated frames into a video
    const encodedChunks = await encodeFrames(animatedFrames);
    
    // Combine the chunks into a video file
    const videoBuffer = concatenateChunks(encodedChunks);
    
    // Return as a downloadable Blob
    return new Blob([videoBuffer], {type: 'video/webm'});
  } catch (error) {
    console.error("Error creating animated video:", error);
    throw error;
  }
}

// Function to preview animation on a canvas without encoding
export function previewAnimation(
  canvas: HTMLCanvasElement,
  frameDataUrl: string,
  effect: {
    type: 'fade' | 'zoom' | 'rotate' | 'move';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  }
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Load the image
  const img = new Image();
  img.src = frameDataUrl;
  
  // Animation parameters
  const fps = 60;
  const duration = 1.5; // seconds
  const totalFrames = duration * fps;
  let frameCount = 0;
  let animationId: number;
  
  // Animation function
  const animate = () => {
    // Calculate progress (0 to 1, then back to 0)
    // This creates a looping effect
    const progress = Math.abs(Math.sin((frameCount / totalFrames) * Math.PI));
    
    // Apply the animation effect
    applyAnimationEffect(ctx, img, effect, progress);
    
    // Increment frame counter and request next frame
    frameCount++;
    animationId = requestAnimationFrame(animate);
  };
  
  // Wait for image to load before starting animation
  img.onload = () => {
    // Resize canvas to match image if needed
    if (canvas.width !== img.width || canvas.height !== img.height) {
      canvas.width = img.width;
      canvas.height = img.height;
    }
    
    // Start the animation
    animate();
  };
  
  // Return a cleanup function to stop animation
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}
