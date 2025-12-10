
import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Page } from '../types';

interface HeroProps {
  onCtaClick: () => void;
  onChatClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick, onChatClick }) => {
  return (
    <div className="relative h-[95vh] min-h-[700px] bg-black overflow-hidden flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            className="w-full h-full object-cover"
            src="team photo.png"
            alt="Women collaborating in AI"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2938&auto=format&fit=crop"; 
            }}
          />
        </motion.div>
        {/* Stronger Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-2/3 lg:w-1/2"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-8 h-[2px] bg-rose-600"></span>
            <span className="text-rose-500 text-sm font-bold tracking-widest uppercase">
              Ethical AI Reference Manual
            </span>
          </motion.div>
          
          {/* Removed text gradients, using solid white and brand red */}
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8 font-serif">
            A Living Framework for <span className="text-rose-600">Ethical Leadership</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-light max-w-lg shadow-black drop-shadow-md">
            Welcome to the SHE IS AI Ethics Manual. This digital experience serves as your guide to implementing Responsible AI, navigating governance, and ensuring technology serves human dignity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCtaClick}
              className="px-8 py-4 bg-white text-gray-900 text-base font-bold rounded-full transition-all flex items-center justify-center gap-3 hover:bg-gray-100"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onChatClick}
              className="px-8 py-4 bg-rose-600 text-white text-base font-bold rounded-full hover:bg-rose-700 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={2} />
              Ask The Manual
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
