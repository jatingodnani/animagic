
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  opacity?: boolean;
  scale?: boolean;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.3,
  direction = 'up',
  opacity = true,
  scale = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  // Get transform values based on direction
  const getTransforms = () => {
    const amount = 200 * speed;
    
    switch(direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [amount, -amount]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-amount, amount]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [amount, -amount]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-amount, amount]);
      default:
        return useTransform(scrollYProgress, [0, 1], [amount, -amount]);
    }
  };
  
  const y = direction === 'up' || direction === 'down' ? getTransforms() : 0;
  const x = direction === 'left' || direction === 'right' ? getTransforms() : 0;
  
  const opacityValue = opacity 
    ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]) 
    : 1;
  
  const scaleValue = scale 
    ? useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]) 
    : 1;
  
  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        style={{ 
          y, 
          x, 
          opacity: opacityValue,
          scale: scaleValue
        }}
        transition={{ ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;
