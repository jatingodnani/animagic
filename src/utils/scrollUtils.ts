
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
