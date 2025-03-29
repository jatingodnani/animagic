
import React, { useEffect, useRef } from 'react';

interface Shape {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  xSpeed: number;
  ySpeed: number;
  type: 'circle' | 'square' | 'triangle' | 'donut';
}

interface FloatingShapesProps {
  count?: number;
  className?: string;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ 
  count = 15,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full size of its container
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create shapes
    const shapes: Shape[] = [];
    
    const colors = [
      'rgba(139, 92, 246, 0.3)', // Purple
      'rgba(139, 92, 246, 0.2)', // Light purple
      'rgba(99, 102, 241, 0.3)', // Indigo
      'rgba(59, 130, 246, 0.2)', // Blue
      'rgba(236, 72, 153, 0.2)', // Pink
    ];
    
    const types: Array<Shape['type']> = ['circle', 'square', 'triangle', 'donut'];
    
    for (let i = 0; i < count; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        xSpeed: (Math.random() - 0.5) * 0.5,
        ySpeed: (Math.random() - 0.5) * 0.5,
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
    
    const drawShape = (shape: Shape) => {
      if (!ctx) return;
      
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;
      ctx.fillStyle = shape.color;
      
      const halfSize = shape.size / 2;
      
      switch (shape.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'square':
          ctx.fillRect(-halfSize, -halfSize, shape.size, shape.size);
          break;
          
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -halfSize);
          ctx.lineTo(-halfSize, halfSize);
          ctx.lineTo(halfSize, halfSize);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'donut':
          ctx.beginPath();
          ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
          ctx.arc(0, 0, halfSize * 0.6, 0, Math.PI * 2, true);
          ctx.fill();
          break;
      }
      
      ctx.restore();
    };
    
    const updateShape = (shape: Shape) => {
      shape.x += shape.xSpeed;
      shape.y += shape.ySpeed;
      shape.rotation += shape.rotationSpeed;
      
      // Wrap around edges
      if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
      if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
      if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
      if (shape.y > canvas.height + shape.size) shape.y = -shape.size;
    };
    
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      shapes.forEach(shape => {
        updateShape(shape);
        drawShape(shape);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [count]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default FloatingShapes;
