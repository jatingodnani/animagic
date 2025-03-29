
import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayAfterType?: number;
  delayAfterDelete?: number;
  cursor?: boolean;
  cursorChar?: string;
  infinite?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  texts,
  className = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  delayAfterType = 2000,
  delayAfterDelete = 500,
  cursor = true,
  cursorChar = '|',
  infinite = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const textIndex = useRef(0);
  const charIndex = useRef(0);
  
  useEffect(() => {
    if (texts.length === 0) return;
    
    let timeout: NodeJS.Timeout;
    
    if (isTyping && !isDeleting) {
      // Typing text
      if (charIndex.current < texts[textIndex.current].length) {
        timeout = setTimeout(() => {
          setDisplayText(texts[textIndex.current].substring(0, charIndex.current + 1));
          charIndex.current += 1;
        }, typingSpeed);
      } else {
        // Finished typing
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delayAfterType);
      }
    } else if (isDeleting) {
      // Deleting text
      if (charIndex.current > 0) {
        timeout = setTimeout(() => {
          setDisplayText(texts[textIndex.current].substring(0, charIndex.current - 1));
          charIndex.current -= 1;
        }, deletingSpeed);
      } else {
        // Finished deleting
        setIsDeleting(false);
        
        if (infinite || textIndex.current < texts.length - 1) {
          // Move to next text
          textIndex.current = (textIndex.current + 1) % texts.length;
          timeout = setTimeout(() => {
            setIsTyping(true);
          }, delayAfterDelete);
        }
      }
    }
    
    return () => clearTimeout(timeout);
  }, [
    texts, 
    displayText, 
    isTyping, 
    isDeleting, 
    typingSpeed, 
    deletingSpeed,
    delayAfterType,
    delayAfterDelete,
    infinite
  ]);
  
  return (
    <span className={className}>
      {displayText}
      {cursor && <span className="opacity-70 animate-pulse">{cursorChar}</span>}
    </span>
  );
};

export default TypewriterText;
