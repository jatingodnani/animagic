
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCursorProps {
  color?: string;
  size?: number;
  duration?: number;
  trailCount?: number;
  trailFade?: boolean;
  trailScale?: boolean;
  clickEffect?: boolean;
}

const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  color = 'rgba(139, 92, 246, 0.7)',
  size = 16,
  duration = 0.4,
  trailCount = 6,
  trailFade = true,
  trailScale = true,
  clickEffect = true
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    if (clickEffect) {
      window.addEventListener('mousedown', handleMouseDown);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (clickEffect) {
        window.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [clickEffect]);
  
  // Create cursor trail elements
  const trails = [...Array(trailCount)].map((_, index) => {
    const delay = index * (duration / trailCount);
    
    return (
      <motion.div
        key={index}
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full"
        style={{
          backgroundColor: color,
          width: size,
          height: size,
        }}
        animate={{
          x: mousePosition.x - size / 2,
          y: mousePosition.y - size / 2,
          opacity: trailFade ? 1 - (index / trailCount) : 1,
          scale: trailScale ? 1 - (index / trailCount * 0.5) : 1,
        }}
        transition={{
          duration: duration,
          ease: "linear",
          delay: delay,
        }}
      />
    );
  });
  
  return (
    <>
      {trails}
      
      {/* Click effect */}
      {clicked && clickEffect && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border-2"
          style={{
            borderColor: color,
            x: mousePosition.x - size * 2,
            y: mousePosition.y - size * 2,
            width: size * 4,
            height: size * 4,
          }}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </>
  );
};

export default AnimatedCursor;
