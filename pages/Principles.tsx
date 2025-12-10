import React from 'react';
import { CORE_VALUES } from '../constants';
import * as Icons from 'lucide-react';

export const Principles: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Foundational Principles</h1>
          <p className="text-xl text-gray-600 font-light">
            Our core values aren't add-ons; they are the fundamental DNA of everything we create. 
            Remove any one, and the entire framework becomes unstable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((value, idx) => {
            // Dynamic Icon Rendering safely
            const IconComponent = (Icons as any)[value.iconName] || Icons.Star;
            
            return (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-rose-50 transition-colors">
                  <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-rose-600 transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Values Integration Framework</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-semibold text-rose-600 mb-4 tracking-wide text-sm uppercase">The SHE IS AI Decision Filter</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-4 group">
                  <Icons.CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span><strong className="text-gray-900">Ethics Check:</strong> Does this decision serve human dignity?</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <Icons.CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span><strong className="text-gray-900">Equity Assessment:</strong> Who benefits from this decision? Who is excluded?</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <Icons.CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span><strong className="text-gray-900">Inclusion Evaluation:</strong> Whose voices informed this decision?</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <Icons.CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span><strong className="text-gray-900">Sustainability Assessment:</strong> What is the long-term impact?</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl flex items-center">
              <p className="text-lg text-gray-600 italic font-light leading-relaxed">
                "Ethics without equity becomes theoretical. Equity without inclusion creates tokenism. 
                Inclusion without empowerment maintains dependency."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};