import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Film, Settings, Upload, Play, Presentation } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const createHashLink = (hash: string) => {
    if (location.pathname === '/') {
      return `#${hash}`;
    }
    return `/#${hash}`;
  };
  
  return (
    <header className="w-full py-4 px-4 md:px-8 border-b bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-animation-purple" />
            <span className="text-xl font-semibold">AniMagic</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-animation-purple transition-colors">
              Home
            </Link>
            <Link to="/editor" className="text-sm font-medium hover:text-animation-purple transition-colors">
              Editor
            </Link>
            <Link to="/presentation" className="text-sm font-medium hover:text-animation-purple transition-colors">
              Presentation
            </Link>
            <Link to={createHashLink('features')} className="text-sm font-medium hover:text-animation-purple transition-colors">
              Features
            </Link>
            <Link to={createHashLink('tutorial')} className="text-sm font-medium hover:text-animation-purple transition-colors">
              How It Works
            </Link>
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
