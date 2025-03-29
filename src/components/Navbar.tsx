
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Film, Settings, Upload, Play, Presentation, ArrowUp } from 'lucide-react';
import { scrollToSection, scrollToTop } from '@/utils/scrollUtils';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSectionNavigation = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToId: sectionId } });
    } else {
      scrollToSection(sectionId);
    }
  };
  
  return (
    <header className="w-full py-4 px-4 md:px-8 border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={() => scrollToTop()}>
            <Film className="h-6 w-6 text-animation-purple" />
            <span className="text-xl font-semibold">AniMagic</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-animation-purple transition-colors" onClick={() => scrollToTop()}>
              Home
            </Link>
            <Link to="/editor" className="text-sm font-medium hover:text-animation-purple transition-colors">
              Editor
            </Link>
            <Link to="/presentation" className="text-sm font-medium hover:text-animation-purple transition-colors">
              Presentation
            </Link>
            <button 
              onClick={() => handleSectionNavigation('features')} 
              className="text-sm font-medium hover:text-animation-purple transition-colors bg-transparent border-none cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => handleSectionNavigation('tutorial')} 
              className="text-sm font-medium hover:text-animation-purple transition-colors bg-transparent border-none cursor-pointer"
            >
              How It Works
            </button>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link to="/editor">
              <Button variant="default" className="bg-animation-purple hover:bg-animation-purple/90">
                Start Editing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
