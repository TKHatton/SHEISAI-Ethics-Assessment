
import React from 'react';
import { Hero } from '../components/Hero';
import { PILLARS } from '../constants';
import { Layers, Globe, Heart, Sparkles, Zap, ArrowUpRight, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { Page } from '../types';
import { motion } from 'framer-motion';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Hero 
        onCtaClick={() => onNavigate(Page.PRINCIPLES)} 
        onChatClick={() => onNavigate(Page.CHAT)}
      />

      {/* Vision Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold text-rose-600 tracking-widest uppercase mb-4">Our Commitment</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 font-serif leading-tight">
              Innovation requires <span className="italic text-rose-600">representation</span>.
            </h3>
            <p className="max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed font-light">
              This manual is a living agreement. It invites us to pause, reflect, and ensure that our work honors both our values and the communities we represent. We are crafting the gold standard for ethical AI leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Manual CTA */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-[2.5rem] p-12 md:p-16 overflow-hidden shadow-2xl"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              {/* Icon/Visual */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-600/30 blur-2xl rounded-full"></div>
                  <div className="relative bg-gradient-to-br from-rose-600 to-rose-700 p-8 rounded-3xl shadow-xl">
                    <BookOpen className="w-16 h-16 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/20 backdrop-blur-sm text-rose-400 text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3" strokeWidth={2} />
                  Interactive Resource
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
                  The Complete Ethics Manual
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                  Access our comprehensive, living framework with real-time updates. Explore detailed guidelines, cultural intelligence frameworks, and practical examples for implementing ethical AI across every touchpoint.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
                  <a
                    href="https://www.canva.com/design/DAG1hulHY68/hkXsCknKlTq2OXCIEI-9pw/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-rose-600 text-white font-bold rounded-full shadow-xl hover:bg-rose-700 hover:scale-105 transition-all duration-300 group"
                  >
                    <ExternalLink className="w-5 h-5 mr-3 group-hover:rotate-45 transition-transform duration-300" strokeWidth={2} />
                    View Full Manual
                  </a>
                  <button
                    onClick={() => onNavigate(Page.CHAT)}
                    className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" strokeWidth={1.5} />
                    Ask The Manual
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Ecosystem */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Holistic Ecosystem</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Equity is woven into the DNA of every pillar of our organization. Explore how we implement these values across our five distinct areas of impact.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {PILLARS.map((pillar, idx) => (
              <motion.a
                key={idx}
                href={pillar.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group cursor-pointer block"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-rose-50 transition-colors duration-300">
                    {idx === 0 && <Layers className="text-gray-700 w-7 h-7 group-hover:text-rose-600 transition-colors" strokeWidth={1.5} />}
                    {idx === 1 && <Heart className="text-gray-700 w-7 h-7 group-hover:text-rose-600 transition-colors" strokeWidth={1.5} />}
                    {idx === 2 && <Sparkles className="text-gray-700 w-7 h-7 group-hover:text-rose-600 transition-colors" strokeWidth={1.5} />}
                    {idx === 3 && <Zap className="text-gray-700 w-7 h-7 group-hover:text-rose-600 transition-colors" strokeWidth={1.5} />}
                    {idx === 4 && <Globe className="text-gray-700 w-7 h-7 group-hover:text-rose-600 transition-colors" strokeWidth={1.5} />}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-rose-600 transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{pillar.description}</p>
              </motion.a>
            ))}
            
            {/* Call to Action Card */}
            <motion.div 
              variants={itemVariants}
              onClick={() => onNavigate(Page.GLOBAL)}
              className="bg-black p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center cursor-pointer group"
            >
              <h3 className="text-xl font-bold mb-4">Join the Movement</h3>
              <p className="text-gray-300 mb-6 text-sm">Be part of the one million women changing the face of AI.</p>
              <div className="flex items-center gap-2 font-medium text-rose-500 group-hover:text-rose-400 transition-colors text-sm">
                View Global Impact <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Commitment */}
      <section className="py-24 relative overflow-hidden bg-rose-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif">Ethics Cannot Be Delegated.</h2>
            <p className="text-white/90 text-lg leading-relaxed mb-10 font-light">
              It is everyone's responsibility. Whether you are leading a workshop, organizing an event, or co-creating a project, you carry the power to uphold our standards.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(Page.CHAT)}
              className="px-10 py-4 bg-white text-rose-600 font-bold rounded-full shadow-xl hover:bg-gray-50 transition-all flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              Ask The Manual
            </motion.button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:w-1/2 flex justify-center"
          >
             <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
                <div className="relative bg-white/10 backdrop-blur-md p-16 rounded-full border border-white/20 shadow-2xl">
                  <Heart className="w-32 h-32 text-white" strokeWidth={1} />
                </div>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
