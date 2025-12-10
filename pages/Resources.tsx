
import React from 'react';
import { FileText, CheckSquare, ExternalLink, Play, Quote } from 'lucide-react';

export const Resources: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center font-serif">Resources & Toolkit</h1>

        {/* Featured Video Section */}
        <div className="bg-black rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden shadow-xl">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-30">
                <img 
                    src="team photo.png" 
                    alt="Background" 
                    className="w-full h-full object-cover grayscale"
                    onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop";
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider mb-6">
                        <Play className="w-3 h-3 fill-current" />
                        Featured Video
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-6 font-serif leading-tight">
                        Innovation without intention <span className="text-rose-500">is incomplete.</span>
                    </h2>
                    <div className="flex gap-4">
                        <Quote className="w-8 h-8 text-rose-600 flex-shrink-0 opacity-50" strokeWidth={1.5} />
                        <p className="text-gray-300 text-lg leading-relaxed font-light italic">
                            "This manual reminds us that innovation without intention is incomplete. Behind every data set, there are human lives, stories, and dignity."
                        </p>
                    </div>
                </div>
                
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                    <video
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                        poster="team photo.png"
                    >
                        <source src="assets/videos/SHE_IS_AI__Ethics_of_Action.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Checklist Card */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-rose-50 rounded-xl">
                <CheckSquare className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold">Content Creation Checklist</h2>
            </div>
            <ul className="space-y-5">
              {[
                "Is AI assistance clearly disclosed?",
                "Does content represent diverse cultures authentically?",
                "Are human experts identified as the authority?",
                "Have Global Ambassadors reviewed for cultural nuance?",
                "Is the content accessible (WCAG 2.1 AA)?",
                "Does it avoid stereotypes and tokenism?"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded border border-gray-300 mt-0.5 flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decision Tree Card */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-rose-50 rounded-xl">
                <FileText className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold">AI Tool Usage Decision</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Scenario: Culturally Neutral Content</h3>
                <p className="text-sm text-gray-600 mb-3">Technical explanations, formatting.</p>
                <div className="text-rose-600 font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  AI Assistance Appropriate
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Scenario: Cultural Examples</h3>
                <p className="text-sm text-gray-600 mb-3">Community stories, traditions.</p>
                <div className="text-rose-600 font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  Human-Led Development
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Scenario: Sensitive Topics</h3>
                <p className="text-sm text-gray-600 mb-3">Personal stories, trauma, bias discussion.</p>
                <div className="text-rose-600 font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  Human-Only Development
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action for Manual */}
        <div className="mt-20 bg-gradient-to-br from-rose-600 to-rose-700 rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider mb-6">
              <FileText className="w-4 h-4" strokeWidth={2} />
              Living Document
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">
              Explore the Complete Ethics Manual
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Dive deep into our comprehensive framework. Access the full interactive manual with real-time updates, detailed guidelines, and practical examples for ethical AI implementation.
            </p>
            <a
              href="https://www.canva.com/design/DAG1hulHY68/hkXsCknKlTq2OXCIEI-9pw/view"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-10 py-5 bg-white text-rose-600 text-lg font-bold rounded-full shadow-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 group"
            >
              <ExternalLink className="w-6 h-6 mr-3 group-hover:rotate-45 transition-transform duration-300" strokeWidth={2} />
              View Interactive Manual
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
