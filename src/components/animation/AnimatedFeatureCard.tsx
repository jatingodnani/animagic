
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AnimatedFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
  buttonText?: string;
  buttonHref?: string;
  color?: string;
}

const AnimatedFeatureCard: React.FC<AnimatedFeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  delay = 0,
  buttonText,
  buttonHref = '#',
  color = 'animation-purple'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="feature-card group relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.2 }}
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-${color}/20 to-${color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      
      {/* Animated border */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute top-0 left-0 w-full h-[2px] bg-${color}`}
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 1, ease: 'easeInOut', repeat: isHovered ? Infinity : 0 }}
        />
        <motion.div 
          className={`absolute top-0 right-0 w-[2px] h-full bg-${color}`}
          initial={{ y: '-100%' }}
          animate={isHovered ? { y: '100%' } : { y: '-100%' }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeInOut', repeat: isHovered ? Infinity : 0 }}
        />
        <motion.div 
          className={`absolute bottom-0 right-0 w-full h-[2px] bg-${color}`}
          initial={{ x: '100%' }}
          animate={isHovered ? { x: '-100%' } : { x: '100%' }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeInOut', repeat: isHovered ? Infinity : 0 }}
        />
        <motion.div 
          className={`absolute bottom-0 left-0 w-[2px] h-full bg-${color}`}
          initial={{ y: '100%' }}
          animate={isHovered ? { y: '-100%' } : { y: '100%' }}
          transition={{ duration: 1, delay: 0.9, ease: 'easeInOut', repeat: isHovered ? Infinity : 0 }}
        />
      </div>
      
      <div className="p-6 z-10 relative">
        <div className={`p-3 rounded-full bg-${color}/10 inline-block mb-4`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        {buttonText && (
          <Button
            variant="ghost"
            className={`group-hover:text-${color} group-hover:bg-${color}/10 transition-colors duration-300`}
            asChild
          >
            <Link to={buttonHref}>
              {buttonText}
              <motion.span 
                className="ml-2"
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default AnimatedFeatureCard;
