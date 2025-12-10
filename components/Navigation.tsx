
import React, { useState } from 'react';
import { Page, NavItem } from '../types';
import { Menu, X, Sparkles, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: Page.HOME, label: 'Home' },
  { id: Page.PRINCIPLES, label: 'Principles' },
  { id: Page.FRAMEWORKS, label: 'Frameworks' },
  { id: Page.GLOBAL, label: 'Global Impact' },
  { id: Page.TEAM, label: 'Our Team' },
  { id: Page.RESOURCES, label: 'Resources' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <motion.a 
              href="https://www.sheisai.ai"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 flex items-center cursor-pointer"
            >
              <img
                src="assets/SHEISAI-Logo-Black-Watermelon-on white.png"
                alt="SHE IS AI Logo"
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-black tracking-tighter"><span class="text-black">SHE</span><span class="text-rose-500">IS</span><span class="text-black">AI</span></span>';
                }}
              />
            </motion.a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 ${
                  currentPage === item.id
                    ? 'text-rose-600'
                    : 'text-gray-600 hover:text-rose-500'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-rose-600" 
                  />
                )}
              </button>
            ))}
            
            <div className="flex items-center gap-3 ml-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNav(Page.REGISTER)}
                className="px-5 py-2.5 bg-white text-gray-900 border border-gray-200 rounded-full font-medium text-sm transition-all hover:border-gray-900 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                Register
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNav(Page.CHAT)}
                className="px-5 py-2.5 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 font-medium text-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                Ask The Manual
              </motion.button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" strokeWidth={1.5} /> : <Menu className="block h-6 w-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium ${
                  currentPage === item.id
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-gray-600 hover:text-rose-500 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav(Page.REGISTER)}
              className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-900 bg-gray-50 border border-gray-200 mt-4 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" strokeWidth={1.5} />
              Register for Training
            </button>
            <button
              onClick={() => handleNav(Page.CHAT)}
              className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white bg-black mt-2 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              Ask The Manual
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};