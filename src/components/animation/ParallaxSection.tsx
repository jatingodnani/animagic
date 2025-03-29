
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  opacity?: boolean;
  scale?: boolean;
  rotation?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
  perspective?: boolean;
  overflow?: 'visible' | 'hidden';
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.3,
  direction = 'up',
  opacity = true,
  scale = false,
  rotation = false,
  staggerChildren = false,
  staggerDelay = 0.1,
  perspective = false,
  overflow = 'hidden',
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
    
  const rotationValue = rotation
    ? useTransform(scrollYProgress, [0, 1], [0, 10])
    : 0;
    
  // Apply perspective transform to create depth
  const perspectiveStyle = perspective ? {
    perspective: '1000px',
    perspectiveOrigin: 'center'
  } : {};
  
  // When staggering children, we need to wrap them for animation
  if (staggerChildren && React.Children.count(children) > 0) {
    const childrenArray = React.Children.toArray(children);
    
    return (
      <div 
        ref={ref} 
        className={`relative ${overflow === 'visible' ? 'overflow-visible' : 'overflow-hidden'} ${className}`}
        style={perspectiveStyle}
      >
        <motion.div
          style={{ 
            y, 
            x, 
            opacity: opacityValue,
            scale: scaleValue,
            rotateZ: rotationValue
          }}
          transition={{ ease: 'easeOut' }}
          className="w-full h-full"
        >
          {childrenArray.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * staggerDelay,
                ease: "easeOut"
              }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }
  
  return (
    <div 
      ref={ref} 
      className={`relative ${overflow === 'visible' ? 'overflow-visible' : 'overflow-hidden'} ${className}`}
      style={perspectiveStyle}
    >
      <motion.div
        style={{ 
          y, 
          x, 
          opacity: opacityValue,
          scale: scaleValue,
          rotateZ: rotationValue
        }}
        transition={{ ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;
