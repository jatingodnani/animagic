
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Twitter, Github, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-animation-gray-100 py-12 px-4 md:px-8">
      <div className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-animation-purple" />
              <span className="text-xl font-semibold">AniMagic</span>
            </div>
            <p className="text-animation-gray-500 mb-6 max-w-md">
              Transform your videos into stunning animations with our powerful web-based editor.
              No software installation required.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://x.com/JGodnani" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/jatingodnani/animedia-magic" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/editor" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                  Editor
                </Link>
              </li>
              <li>
                <a href="#features" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#tutorial" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-animation-gray-500 hover:text-animation-purple transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6">
          <p className="text-sm text-animation-gray-500 text-center">
            © {new Date().getFullYear()} AniMagic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
