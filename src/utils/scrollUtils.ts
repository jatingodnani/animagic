
/**
 * Utility functions for smooth scrolling to page sections
 */

/**
 * Scrolls to a specific element by ID with smooth behavior
 */
export const scrollToSection = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    // Add a small delay to ensure animations are complete
    setTimeout(() => {
      const headerOffset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 100);
  }
};

/**
 * Scrolls to the top of the page with smooth behavior
 */
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Scrolls to specific section with custom offset and callback
 */
export const scrollToSectionWithCallback = (
  elementId: string, 
  offset: number = 80,
  callback?: () => void
): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Execute callback after scrolling animation (roughly 500ms)
    if (callback) {
      setTimeout(callback, 500);
    }
  }
};

/**
 * Sets up intersection observers for animating elements when they come into view
 */
export const setupScrollAnimations = (): void => {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        const delay = element.dataset.delay || '0';
        
        setTimeout(() => {
          element.classList.add('animate-active');
        }, parseInt(delay));
        
        // Unobserve after animation is triggered
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
};

/**
 * Creates a parallax scrolling effect for an element
 */
export const setupParallaxEffect = (): void => {
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  if (!parallaxElements.length) return;
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach((element) => {
      const speed = parseFloat((element as HTMLElement).dataset.speed || '0.2');
      const offset = scrollY * speed;
      
      (element as HTMLElement).style.transform = `translateY(${offset}px)`;
    });
  };
  
  window.addEventListener('scroll', handleScroll);
};

