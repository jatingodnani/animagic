
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
    type: 'fade' | 'zoom' | 'rotate' | 'move' | 'blur' | 'color' | 'sparkle';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
    color?: string;
    keyframes?: {
      position: number; // 0-100 percent of duration
      intensity: number;
    }[];
  },
  progress: number // 0 to 1 representing animation progress
): Promise<void> {
  // Get frame dimensions
  const width = frame instanceof VideoFrame ? frame.displayWidth : frame.width;
  const height = frame instanceof VideoFrame ? frame.displayHeight : frame.height;
  
  // Clear the entire canvas first
  ctx.clearRect(0, 0, width, height);
  
  // Save the canvas state
  ctx.save();
  
  // Normalize intensity to a useful range (0.1-2)
  const normalizedIntensity = effect.intensity / 50;
  
  // Apply different effects based on the type
  switch (effect.type) {
    case 'fade':
      if (effect.direction === 'in') {
        ctx.globalAlpha = progress;
      } else { // 'out'
        ctx.globalAlpha = 1 - progress;
      }
      ctx.drawImage(frame, 0, 0, width, height);
      break;
      
    case 'zoom':
      const zoomCenterX = width / 2;
      const zoomCenterY = height / 2;
      
      // Clear canvas for zoom effect
      ctx.clearRect(0, 0, width, height);
      
      if (effect.direction === 'in') {
        // Start small and grow
        const scale = 1 + (progress * normalizedIntensity);
        
        ctx.translate(zoomCenterX, zoomCenterY);
        ctx.scale(scale, scale);
        ctx.translate(-zoomCenterX, -zoomCenterY);
      } else { // 'out'
        // Start large and shrink
        const scale = 1 + (normalizedIntensity - (progress * normalizedIntensity));
        
        ctx.translate(zoomCenterX, zoomCenterY);
        ctx.scale(scale, scale);
        ctx.translate(-zoomCenterX, -zoomCenterY);
      }
      ctx.drawImage(frame, 0, 0, width, height);
      break;
      
    case 'rotate':
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Clear canvas before rotation
      ctx.clearRect(0, 0, width, height);
      
      // Calculate rotation angle (in radians)
      let rotationAngle;
      if (effect.direction === 'clockwise') {
        rotationAngle = progress * normalizedIntensity * Math.PI * 2;
      } else { // 'counterclockwise'
        rotationAngle = -progress * normalizedIntensity * Math.PI * 2;
      }
      
      // Apply rotation transformation
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationAngle);
      ctx.translate(-centerX, -centerY);
      
      // Draw the rotated image
      ctx.drawImage(frame, 0, 0, width, height);
      break;
      
    case 'move':
      let xOffset = 0;
      let yOffset = 0;
      const moveAmount = width * normalizedIntensity; // Use width for horizontal, height for vertical
      
      // Calculate position based on direction and progress
      switch(effect.direction) {
        case 'left':
          xOffset = -progress * moveAmount;
          break;
        case 'right':
          xOffset = progress * moveAmount;
          break;
        case 'up':
          yOffset = -progress * moveAmount;
          break;
        case 'down':
          yOffset = progress * moveAmount;
          break;
      }
      
      // Draw the image at the calculated position
      ctx.drawImage(frame, xOffset, yOffset, width, height);
      break;
    
    case 'blur':
      // Apply blur filter
      const blurAmount = Math.max(1, Math.round(normalizedIntensity * 20 * progress)); // 1-40px blur
      
      // Unfortunately, OffscreenCanvas doesn't support filter CSS property
      // We need to simulate blur using multiple draws with offsets
      if (blurAmount > 1) {
        ctx.globalAlpha = 0.3;
        const iterations = 3; // More iterations = better blur quality
        
        for (let i = -iterations; i <= iterations; i++) {
          for (let j = -iterations; j <= iterations; j++) {
            ctx.drawImage(
              frame, 
              i * blurAmount / iterations, 
              j * blurAmount / iterations, 
              width, 
              height
            );
          }
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.drawImage(frame, 0, 0, width, height);
      }
      break;
      
    case 'color':
      // Draw the original image
      ctx.drawImage(frame, 0, 0, width, height);
      
      // Apply color overlay with intensity as opacity
      if (effect.color) {
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = progress * (normalizedIntensity * 0.7); // Max 70% overlay
        ctx.fillStyle = effect.color;
        ctx.fillRect(0, 0, width, height);
      }
      break;
      
    case 'sparkle':
      // Draw the original image
      ctx.drawImage(frame, 0, 0, width, height);
      
      // Draw sparkles
      const sparkleCount = Math.round(normalizedIntensity * 20); // 10-40 sparkles
      
      ctx.globalCompositeOperation = 'lighter';
      
      for (let i = 0; i < sparkleCount; i++) {
        // Calculate position based on progress - make sparkles move across the image
        const posX = Math.random() * width;
        const posY = Math.random() * height;
        
        // Size based on progress - make sparkles grow and shrink
        const sizeFactor = Math.sin((progress * Math.PI) + (i * 0.2));
        const size = 2 + (sizeFactor * 5);
        
        // Opacity based on progress and position
        ctx.globalAlpha = 0.6 * sizeFactor;
        
        // Draw a sparkle (small star)
        ctx.fillStyle = 'white';
        
        // Draw a simple star
        ctx.beginPath();
        ctx.arc(posX, posY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a glow
        const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, size * 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(posX, posY, size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      break;
      
    default:
      // Default to just drawing the frame
      ctx.drawImage(frame, 0, 0, width, height);
  }
  
  // Restore the canvas state
  ctx.restore();
}

// Step 2: Animate the frame for a specific duration in seconds
export async function animateFrame(
  frame: VideoFrame,
  effect: {
    type: 'fade' | 'zoom' | 'rotate' | 'move' | 'blur' | 'color' | 'sparkle';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
    color?: string;
  },
  durationInSeconds: number,
  fps: number
): Promise<VideoFrame[]> {
  // Create an OffscreenCanvas with the frame dimensions
  const canvas = new OffscreenCanvas(frame.displayWidth, frame.displayHeight);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  const totalFrames = Math.round(durationInSeconds * fps);
  console.log(`Creating animation with ${totalFrames} frames over ${durationInSeconds} seconds at ${fps} fps`);
  
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
export async function encodeFrames(frames: VideoFrame[]): Promise<ArrayBuffer> {
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
      error: (e) => reject(e)
    });
    
    try {
      encoder.configure({
        codec: 'vp8',
        width: frames[0].displayWidth,
        height: frames[0].displayHeight,
        bitrate: 2_000_000, // 2 Mbps
        framerate: 30
      });
      
      // Encode each frame
      frames.forEach((frame, index) => {
        const isKeyFrame = index % 30 === 0; // Key frame every 30 frames
        encoder.encode(frame, { keyFrame: isKeyFrame });
        frame.close(); // Release frame after encoding
      });
      
      // When flushing completes, process the chunks and resolve
      encoder.flush().then(() => {
        // Create a single buffer from all chunks
        const totalSize = chunks.reduce((size, chunk) => size + chunk.byteLength, 0);
        const buffer = new ArrayBuffer(totalSize);
        const view = new Uint8Array(buffer);
        
        let offset = 0;
        chunks.forEach(chunk => {
          // Copy chunk data to the buffer
          const chunkData = new Uint8Array(chunk.byteLength);
          chunk.copyTo(chunkData);
          view.set(chunkData, offset);
          offset += chunk.byteLength;
        });
        
        resolve(buffer);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Main function to create animated video from a single frame with a specified duration
export async function createAnimatedVideo(
  videoFile: File,
  targetFrameIndex: number,
  effect: {
    type: 'fade' | 'zoom' | 'rotate' | 'move' | 'blur' | 'color' | 'sparkle';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
    color?: string;
  },
  animationDurationInSeconds: number,
  fps: number
): Promise<Blob> {
  try {
    console.log(`Creating animated video for ${animationDurationInSeconds} seconds at ${fps} fps`);
    
    // Extract the target frame
    const extractedFrame = await extractFrame(videoFile, targetFrameIndex);
    
    // Apply animation to create sequence of frames for the specified duration
    const animatedFrames = await animateFrame(extractedFrame, effect, animationDurationInSeconds, fps);
    
    // Close the original frame after we're done with it
    extractedFrame.close();
    
    // Encode the animated frames into a video
    const videoBuffer = await encodeFrames(animatedFrames);
    
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
    type: 'fade' | 'zoom' | 'rotate' | 'move' | 'blur' | 'color' | 'sparkle';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
    color?: string;
  },
  durationInSeconds: number = 5 // Default preview duration of 5 seconds
): () => void {
  console.log(`Previewing animation for ${durationInSeconds} seconds with effect type: ${effect.type}`);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Load the image
  const img = new Image();
  img.src = frameDataUrl;
  
  // Animation parameters
  const fps = 60; // Fixed fps for smooth animation
  let animationId: number;
  let startTime: number | null = null;
  
  // Animation function
  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    
    // Calculate elapsed time and progress
    const elapsedTime = timestamp - startTime;
    const elapsedSeconds = elapsedTime / 1000;
    
    // Calculate progress (0 to 1) based on actual elapsed time, ensuring it loops properly
    // This ensures the animation takes exactly durationInSeconds to complete
    const progress = (elapsedSeconds % durationInSeconds) / durationInSeconds;
    
    // Clear canvas before drawing the next frame to prevent overlapping
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply the animation effect based on current progress
    applyAnimationEffect(ctx, img, effect, progress);
    
    // Continue animation loop
    animationId = requestAnimationFrame(animate);
  };
  
  // Wait for image to load before starting animation
  img.onload = () => {
    // Resize canvas to match image if needed
    if (canvas.width !== img.width || canvas.height !== img.height) {
      canvas.width = img.width;
      canvas.height = img.height;
    }
    
    console.log(`Starting animation preview with dimensions ${img.width}x${img.height} for ${durationInSeconds} seconds`);
    
    // Start the animation
    animationId = requestAnimationFrame(animate);
  };
  
  // Return a cleanup function to stop animation
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}

// New utility function to save an animation preset
export function saveAnimationPreset(preset: {
  name: string;
  type: string;
  intensity: number;
  direction?: string;
  duration: number;
  color?: string;
}) {
  // Get existing presets from localStorage
  const existingPresetsString = localStorage.getItem('animationPresets');
  let existingPresets = existingPresetsString ? JSON.parse(existingPresetsString) : [];
  
  // Add new preset with unique ID
  const newPreset = {
    ...preset,
    id: `custom-${Date.now()}`,
  };
  
  // Add to start of array
  existingPresets = [newPreset, ...existingPresets];
  
  // Save back to localStorage
  localStorage.setItem('animationPresets', JSON.stringify(existingPresets));
  
  return newPreset;
}

// Function to get user-saved presets
export function getUserPresets() {
  const presetsString = localStorage.getItem('animationPresets');
  return presetsString ? JSON.parse(presetsString) : [];
}
