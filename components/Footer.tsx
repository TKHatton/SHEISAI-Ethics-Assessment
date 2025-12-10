
import React from 'react';
import { Linkedin, Twitter, Mail, Instagram, Facebook, Youtube, ExternalLink } from 'lucide-react';

const TikTokIcon = ({ className, strokeWidth }: { className?: string; strokeWidth?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth || 2} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 text-gray-900 py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <a href="https://www.sheisai.ai">
              <img
                src="assets/SHEISAI-Logo-Black-Watermelon-on white.png"
                alt="SHE IS AI"
                className="h-14 w-auto mb-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<h3 class="text-2xl font-bold mb-6 text-gray-900">SHE IS AI</h3>';
                }}
              />
            </a>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm mb-8">
              A Living Framework for Ethical AI, Responsible AI, and AI Governance. 
              We are positioning one million women as leading AI Xperts to transform industries and communities worldwide.
            </p>
            <div className="flex space-x-5 text-gray-500">
              <a href="https://www.linkedin.com/company/sheisai/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                <Linkedin className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="https://www.instagram.com/sheisai.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="https://www.facebook.com/sheisaiofficial" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                <Facebook className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="https://www.youtube.com/@sheisaiofficial" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                <Youtube className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="https://www.tiktok.com/@sheisaiofficial" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                <TikTokIcon className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-6 text-gray-900 uppercase tracking-wider">The Ecosystem</h4>
            <ul className="space-y-4 text-gray-600 text-sm">
              <li><a href="https://sheisai.ai/magazine" className="hover:text-rose-600 transition-colors">Magazine</a></li>
              <li><a href="https://sheisai.ai/she-is-ai-community" className="hover:text-rose-600 transition-colors">Community</a></li>
              <li><a href="https://sheisai.ai/xpert-academy" className="hover:text-rose-600 transition-colors">Education</a></li>
              <li><a href="https://sheisai.ai/xpert-agency" className="hover:text-rose-600 transition-colors">Xpert Agency</a></li>
              <li><a href="https://sheisai.ai/events-1" className="hover:text-rose-600 transition-colors">Events</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-6 text-gray-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-gray-600 text-sm">
              <li><a href="https://sheisai.ai/about" className="hover:text-rose-600 transition-colors">About Us</a></li>
              <li><a href="https://sheisai.ai/contact-us" className="hover:text-rose-600 transition-colors">Contact</a></li>
              <li>
                <a 
                  href="https://sheisai.ai/she-is-ai-community" 
                  className="inline-flex items-center mt-2 px-4 py-2 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Join the Community
                  <ExternalLink className="w-3 h-3 ml-2" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SHE IS AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-rose-600">Privacy Policy</a>
            <a href="#" className="hover:text-rose-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};