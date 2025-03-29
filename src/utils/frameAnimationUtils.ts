
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
    type: 'fade' | 'zoom' | 'rotate' | 'move';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  },
  progress: number // 0 to 1 representing animation progress
): Promise<void> {
  // Save the canvas state
  ctx.save();
  
  // Get frame dimensions
  const width = frame instanceof VideoFrame ? frame.displayWidth : frame.width;
  const height = frame instanceof VideoFrame ? frame.displayHeight : frame.height;
  
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);
  
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
      const zoomCenter = width / 2;
      const zoomCenterY = height / 2;
      
      if (effect.direction === 'in') {
        // Start small and grow
        const scale = 1 + (progress * normalizedIntensity);
        const offsetX = (width - width * scale) / 2;
        const offsetY = (height - height * scale) / 2;
        
        ctx.translate(zoomCenter, zoomCenterY);
        ctx.scale(scale, scale);
        ctx.translate(-zoomCenter, -zoomCenterY);
      } else { // 'out'
        // Start large and shrink
        const scale = 1 + (normalizedIntensity - (progress * normalizedIntensity));
        const offsetX = (width - width * scale) / 2;
        const offsetY = (height - height * scale) / 2;
        
        ctx.translate(zoomCenter, zoomCenterY);
        ctx.scale(scale, scale);
        ctx.translate(-zoomCenter, -zoomCenterY);
      }
      ctx.drawImage(frame, 0, 0, width, height);
      break;
      
    case 'rotate':
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.translate(centerX, centerY);
      
      if (effect.direction === 'clockwise') {
        ctx.rotate(progress * normalizedIntensity * Math.PI * 2);
      } else { // 'counterclockwise'
        ctx.rotate(-progress * normalizedIntensity * Math.PI * 2);
      }
      
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(frame, 0, 0, width, height);
      break;
      
    case 'move':
      let xOffset = 0;
      let yOffset = 0;
      const moveAmount = width * normalizedIntensity; // Use width for horizontal, height for vertical
      
      switch(effect.direction) {
        case 'left':
          xOffset = (1 - progress) * moveAmount;
          break;
        case 'right':
          xOffset = (progress - 1) * moveAmount;
          break;
        case 'up':
          yOffset = (1 - progress) * moveAmount;
          break;
        case 'down':
          yOffset = (progress - 1) * moveAmount;
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

// Step 2: Animate the frame for a specific duration in seconds
export async function animateFrame(
  frame: VideoFrame,
  effect: {
    type: 'fade' | 'zoom' | 'rotate' | 'move';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
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
    type: 'fade' | 'zoom' | 'rotate' | 'move';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  },
  animationDurationInSeconds: number,
  fps: number
): Promise<Blob> {
  try {
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
    type: 'fade' | 'zoom' | 'rotate' | 'move';
    intensity: number;
    direction?: 'in' | 'out' | 'left' | 'right' | 'up' | 'down' | 'clockwise' | 'counterclockwise';
  },
  durationInSeconds: number = 5 // Default preview duration of 5 seconds
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
  const totalFrames = durationInSeconds * fps;
  let frameCount = 0;
  let animationId: number;
  
  // Animation function
  const animate = () => {
    // Calculate progress (0 to 1)
    // For looping animation we use sin, for one-time animation use frameCount/totalFrames directly
    const progress = Math.min(frameCount / totalFrames, 1);
    
    // Apply the animation effect
    applyAnimationEffect(ctx, img, effect, progress);
    
    // Increment frame counter and request next frame
    frameCount++;
    
    if (frameCount <= totalFrames) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Reset animation after completing the duration
      frameCount = 0;
      animationId = requestAnimationFrame(animate);
    }
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
