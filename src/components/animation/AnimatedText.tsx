
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  highlightColor?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  delay = 0,
  highlightColor = 'bg-animation-purple/20'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (textRef.current) {
      observer.observe(textRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  const words = text.split(' ');
  
  return (
    <div ref={textRef} className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap">
        {words.map((word, index) => (
          <span key={index} className="mr-2 mb-2 relative">
            <span
              className={`inline-block transition-transform duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-full opacity-0'
              }`}
              style={{ transitionDelay: `${delay + index * 80}ms` }}
            >
              {word}
            </span>
            
            {/* Random highlight effect for some words */}
            {Math.random() > 0.7 && (
              <span 
                className={`absolute bottom-0 left-0 w-full h-[30%] ${highlightColor} -z-10 transform origin-left transition-transform duration-700`}
                style={{ 
                  transitionDelay: `${delay + (words.length + index) * 80}ms`,
                  transform: isVisible ? 'scaleX(1)' : 'scaleX(0)'
                }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnimatedText;
