import React from 'react';
import { Shield, Settings, Database, Eye } from 'lucide-react';

export const Frameworks: React.FC = () => {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Ethical & Responsible AI</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            We distinguish between the moral compass (Ethical AI) and the operational roadmap (Responsible AI). Both are essential for transformative leadership.
          </p>
        </div>

        {/* Comparison Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-rose-50/50 p-10 rounded-3xl border border-rose-100">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Shield className="w-8 h-8 text-rose-600" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Ethical AI</h2>
            </div>
            <p className="text-gray-900 mb-8 font-medium text-lg">The Moral Compass: "What should we build?"</p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-rose-400 rounded-full mt-2.5"></span>
                <span className="text-gray-600">Focuses on moral principles and values.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-rose-400 rounded-full mt-2.5"></span>
                <span className="text-gray-600">Fairness and Non-Discrimination.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-rose-400 rounded-full mt-2.5"></span>
                <span className="text-gray-600">Transparency and Explainability.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-rose-400 rounded-full mt-2.5"></span>
                <span className="text-gray-600">Beneficence and Non-Maleficence.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Settings className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Responsible AI</h2>
            </div>
            <p className="text-gray-900 mb-8 font-medium text-lg">The Operational Roadmap: "How do we build it safely?"</p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2.5"></span>
                <span className="text-gray-600">Governance Frameworks & Oversight.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2.5"></span>
                <span className="text-gray-600">Risk Assessment and Management.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2.5"></span>
                <span className="text-gray-600">Documentation and Compliance.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2.5"></span>
                <span className="text-gray-600">Continuous Monitoring and Auditing.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Data Ethics Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Data Ethics & Sovereignty</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 p-8 rounded-2xl hover:border-rose-200 transition-colors">
              <Database className="w-8 h-8 text-rose-500 mb-5" strokeWidth={1.5} />
              <h3 className="font-bold mb-3 text-lg">Data Minimization</h3>
              <p className="text-sm text-gray-600 leading-relaxed">We collect only the information necessary to provide high-quality educational experiences.</p>
            </div>
            <div className="border border-gray-200 p-8 rounded-2xl hover:border-rose-200 transition-colors">
              <Eye className="w-8 h-8 text-rose-500 mb-5" strokeWidth={1.5} />
              <h3 className="font-bold mb-3 text-lg">Transparency</h3>
              <p className="text-sm text-gray-600 leading-relaxed">All data collection includes clear explanations about why info is needed and how it will be used.</p>
            </div>
            <div className="border border-gray-200 p-8 rounded-2xl hover:border-rose-200 transition-colors">
              <Shield className="w-8 h-8 text-rose-500 mb-5" strokeWidth={1.5} />
              <h3 className="font-bold mb-3 text-lg">Cultural Sovereignty</h3>
              <p className="text-sm text-gray-600 leading-relaxed">We respect different cultural approaches to data sovereignty and ownership of collective knowledge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};