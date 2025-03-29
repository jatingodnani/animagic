
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Perspective3DCardProps {
  children: React.ReactNode;
  className?: string;
  sensitivity?: number;
  perspective?: number;
  resetOnLeave?: boolean;
  glareEffect?: boolean;
  shadow?: boolean;
}

const Perspective3DCard: React.FC<Perspective3DCardProps> = ({
  children,
  className = '',
  sensitivity = 50,
  perspective = 1000,
  resetOnLeave = true,
  glareEffect = true,
  shadow = true
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / height) * sensitivity * -1;
    const rotateYValue = (mouseX / width) * sensitivity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    
    // For glare effect
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };
  
  const handleMouseLeave = () => {
    if (resetOnLeave) {
      setRotateX(0);
      setRotateY(0);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {shadow && (
        <div 
          className="absolute -inset-[10%] rounded-3xl bg-black/10 blur-2xl -z-10 transition-opacity duration-500"
          style={{
            opacity: Math.abs(rotateX) / sensitivity + Math.abs(rotateY) / sensitivity,
            transform: `translateX(${-rotateY * 0.3}px) translateY(${-rotateX * 0.3}px)`,
          }}
        />
      )}
      
      <motion.div
        className="w-full h-full relative z-10"
        style={{
          perspective: `${perspective}px`,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{
          type: "spring", 
          stiffness: 400, 
          damping: 30,
        }}
      >
        {children}
      </motion.div>
      
      {glareEffect && (
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay" 
          style={{
            background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%)`,
            opacity: (Math.abs(rotateX) + Math.abs(rotateY)) / (sensitivity * 0.8),
          }}
        />
      )}
    </div>
  );
};

export default Perspective3DCard;
