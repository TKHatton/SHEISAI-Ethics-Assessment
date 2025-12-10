import React from 'react';
import { Globe2, Users, MessageCircle } from 'lucide-react';

export const Global: React.FC = () => {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Global Implementation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Cultural intelligence (CQ) is the foundation of authentic global collaboration. We honor local wisdom while building a unified global movement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold mb-8">Cultural Intelligence Principles</h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="flex-shrink-0 mt-1">
                  <MessageCircle className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Deep Listening</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">We approach every context with curiosity, understanding local perspectives before proposing solutions.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex-shrink-0 mt-1">
                  <Users className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Collaborative Design</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Programs are co-created with cultural stakeholders, not imposed from external perspectives.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex-shrink-0 mt-1">
                  <Globe2 className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Multiple Ways of Knowing</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">We value Indigenous knowledge, collective wisdom, and holistic approaches alongside scientific methods.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-3xl p-10 h-full flex flex-col justify-center border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Regional Nuances</h3>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <span className="font-bold text-rose-600 block mb-2 text-sm uppercase tracking-wider">Communication</span>
                <p className="text-sm text-gray-600">Balancing Direct (e.g., US, Germany) vs Indirect (e.g., Japan, Thailand) styles in our programming.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <span className="font-bold text-rose-600 block mb-2 text-sm uppercase tracking-wider">Time Orientation</span>
                <p className="text-sm text-gray-600">Respecting Linear Time (milestones) vs Cyclical Time (relationship-building) approaches.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 rounded-[2.5rem] p-10 md:p-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Global Ambassadors</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            Our ambassadors serve as cultural bridges. They adapt our frameworks to their context, ensuring SHE IS AI serves authentic community needs. They are not just representatives; they are co-creators of our global vision.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
             <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-rose-600 mb-1">5+</div>
                <div className="text-sm font-medium text-gray-500">Continents</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-rose-600 mb-1">1M</div>
                <div className="text-sm font-medium text-gray-500">Goal: Xperts</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-rose-600 mb-1">100%</div>
                <div className="text-sm font-medium text-gray-500">Community Led</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-rose-600 mb-1">24/7</div>
                <div className="text-sm font-medium text-gray-500">Global Learning</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};