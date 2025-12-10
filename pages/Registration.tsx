
import React, { useState, useEffect } from 'react';
import { Calendar, User, Mail, CheckCircle, Clock, AlertTriangle, Globe, Video, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveRegistration } from '../services/supabase';

// ISO Dates for 2026 (Year where Jan 13 is a Tuesday) with EST offset (-05:00)
const SESSIONS = {
  INTENSIVE: [
    { id: '4h-jan13', iso: '2026-01-13T10:00:00-05:00', label: 'Tuesday, Jan 13' },
    { id: '4h-jan17', iso: '2026-01-17T10:00:00-05:00', label: 'Saturday, Jan 17' }
  ],
  PART1: [
    { id: 'p1-jan14-pm', iso: '2026-01-14T15:00:00-05:00', label: 'Wed, Jan 14' },
    { id: 'p1-jan14-eve', iso: '2026-01-14T19:00:00-05:00', label: 'Wed, Jan 14' },
    { id: 'p1-jan15-am', iso: '2026-01-15T10:00:00-05:00', label: 'Thu, Jan 15' },
    { id: 'p1-jan15-pm', iso: '2026-01-15T17:00:00-05:00', label: 'Thu, Jan 15' },
  ],
  PART2: [
    { id: 'p2-jan21-pm', iso: '2026-01-21T15:00:00-05:00', label: 'Wed, Jan 21' },
    { id: 'p2-jan21-eve', iso: '2026-01-21T19:00:00-05:00', label: 'Wed, Jan 21' },
    { id: 'p2-jan22-am', iso: '2026-01-22T10:00:00-05:00', label: 'Thu, Jan 22' },
    { id: 'p2-jan22-pm', iso: '2026-01-22T17:00:00-05:00', label: 'Thu, Jan 22' },
  ]
};

const ZOOM_LINK = "https://us02web.zoom.us/j/82821002196?pwd=tAp9f2hM6BfqGUUdqTBIsLBimY8RSY.1";

export const Registration: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [track, setTrack] = useState<'none' | '4hour' | '2hour'>('none');
  const [userTimeZone, setUserTimeZone] = useState('');
  
  // Form Data State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDateId, setSelectedDateId] = useState('');
  const [part1Id, setPart1Id] = useState('');
  const [part2Id, setPart2Id] = useState('');

  useEffect(() => {
    setUserTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const formatLocalTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('default', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  const getSessionDetails = (id: string, list: typeof SESSIONS.INTENSIVE) => {
    const session = list.find(s => s.id === id);
    return session ? { label: session.label, time: formatLocalTime(session.iso), iso: session.iso } : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // For 4-hour track: save one registration
      if (track === '4hour') {
        const session = SESSIONS.INTENSIVE.find(s => s.id === selectedDateId);
        if (!session) {
          throw new Error('Session not found');
        }

        const startDate = new Date(session.iso);
        const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours

        await saveRegistration({
          email,
          full_name: `${firstName} ${lastName}`.trim(),
          session_id: session.id,
          session_start_utc: startDate.toISOString(),
          session_end_utc: endDate.toISOString(),
          tz: userTimeZone
        });
      }
      // For 2-hour track: save two separate registrations (Part 1 and Part 2)
      else {
        const part1Session = SESSIONS.PART1.find(s => s.id === part1Id);
        const part2Session = SESSIONS.PART2.find(s => s.id === part2Id);

        if (!part1Session || !part2Session) {
          throw new Error('Sessions not found');
        }

        // Save Part 1
        const start1 = new Date(part1Session.iso);
        const end1 = new Date(start1.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

        await saveRegistration({
          email,
          full_name: `${firstName} ${lastName}`.trim(),
          session_id: part1Session.id,
          session_start_utc: start1.toISOString(),
          session_end_utc: end1.toISOString(),
          tz: userTimeZone
        });

        // Save Part 2
        const start2 = new Date(part2Session.iso);
        const end2 = new Date(start2.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

        await saveRegistration({
          email,
          full_name: `${firstName} ${lastName}`.trim(),
          session_id: part2Session.id,
          session_start_utc: start2.toISOString(),
          session_end_utc: end2.toISOString(),
          tz: userTimeZone
        });
      }

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError("We couldn't save your registration. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    let sessionDetailsDisplay = [];
    let duration = "";

    if (track === '4hour') {
      const s = getSessionDetails(selectedDateId, SESSIONS.INTENSIVE);
      if (s) sessionDetailsDisplay.push({ label: "Intensive Session", time: s.time });
      duration = "4 hours";
    } else {
      const p1 = getSessionDetails(part1Id, SESSIONS.PART1);
      const p2 = getSessionDetails(part2Id, SESSIONS.PART2);
      if (p1) sessionDetailsDisplay.push({ label: "Part 1", time: p1.time });
      if (p2) sessionDetailsDisplay.push({ label: "Part 2", time: p2.time });
      duration = "2 hours per session";
    }

    return (
      <div className="py-20 bg-white min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-8 md:p-12 rounded-3xl max-w-2xl w-full border border-gray-100 shadow-lg mx-4"
        >
          <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-rose-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-serif">Registration Confirmed</h2>
              <p className="text-sm text-gray-500">A confirmation email has been sent to {email}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-8 font-light text-gray-800 leading-relaxed shadow-sm">
            <p className="mb-4">Hi {firstName},</p>
            <p className="mb-6">You're registered for the <strong className="font-semibold text-rose-600">SHE IS AI Ethics Training!</strong></p>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Your Training Session Details</h3>
              
              {sessionDetailsDisplay.map((session, idx) => (
                <div key={idx} className="mb-4 last:mb-0">
                  <p className="text-xs font-bold text-gray-500 mb-1">{session.label}</p>
                  <p className="text-lg font-medium text-gray-900">{session.time}</p>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                 <p className="text-sm text-gray-600"><strong>Duration:</strong> {duration}</p>
              </div>
            </div>

            {track === '2hour' && (
              <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6 text-sm text-yellow-800 flex gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>
                  <strong>Reminder:</strong> You must complete both Part 1 and Part 2 to receive certification. 
                  If you need to reschedule one part, please visit <a href="#" className="underline font-semibold hover:text-yellow-900">our main website</a>.
                </p>
              </div>
            )}

            <p className="mb-6">
              This complete training session covers everything you need for certification.
            </p>

            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Calendar Invitation Attached</h4>
              <p className="text-sm text-gray-600">
                This email includes a calendar file (SHE-IS-AI-Ethics-Training.ics) attachment. 
                Click on it to automatically add this training to your calendar app (Google Calendar, Outlook, Apple Calendar, etc.).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <a 
                 href={ZOOM_LINK}
                 target="_blank"
                 rel="noreferrer"
                 className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md gap-2"
               >
                 <Video className="w-4 h-4" />
                 Join via Zoom
               </a>
            </div>

            <p className="text-sm text-gray-500">
              We'll send you a reminder 24 hours before your class with the meeting link and any materials you'll need.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              See you soon!<br />
              The SHE IS AI Team
            </p>
          </div>

          <button 
            onClick={() => {
              setSubmitted(false);
              setTrack('none');
              setFirstName('');
              setLastName('');
              setEmail('');
              setSelectedDateId('');
              setPart1Id('');
              setPart2Id('');
            }}
            className="flex items-center text-gray-500 hover:text-rose-600 transition-colors font-medium text-sm mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Register another participant
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Training Registration</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Secure your spot in our upcoming Ethical AI sessions. 
            <br />
            <span className="text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full mt-3 inline-block">
              <Globe className="w-3 h-3 inline mr-1" />
              Times displayed in your local time: {userTimeZone}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Information Sidebar */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-xl">
              <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" />
                Session Types
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-rose-400 text-sm uppercase tracking-wide mb-2">Option A: Intensive</h4>
                  <p className="text-gray-300 text-sm">One comprehensive 4-hour session covering all modules in a single sitting.</p>
                </div>
                
                <div className="border-t border-gray-800 pt-4">
                  <h4 className="font-bold text-rose-400 text-sm uppercase tracking-wide mb-2">Option B: Split Track</h4>
                  <p className="text-gray-300 text-sm mb-2">Two separate 2-hour sessions.</p>
                  <div className="bg-rose-900/30 border border-rose-500/30 p-3 rounded-lg flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    <p className="text-xs text-rose-200">
                      <strong>Requirement:</strong> You must register for both Part 1 AND Part 2 to receive certification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Why Train With Us?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" strokeWidth={1.5} />
                  Practical, actionable frameworks
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" strokeWidth={1.5} />
                  Global community networking
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" strokeWidth={1.5} />
                  Industry-recognized certification
                </li>
              </ul>
            </div>
          </div>

          {/* Main Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm">
              <div className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                      <input 
                        type="text" 
                        required 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all" 
                        placeholder="Jane" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                      <input 
                        type="text" 
                        required 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all" 
                        placeholder="Doe" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all" 
                      placeholder="jane@example.com" 
                    />
                  </div>
                </div>

                {/* Track Selection */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-lg font-bold text-gray-900 mb-4">Select Training Track</label>
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      type="button"
                      onClick={() => setTrack('4hour')}
                      className={`relative flex items-center p-4 rounded-xl border-2 transition-all text-left ${
                        track === '4hour' 
                          ? 'border-rose-600 bg-rose-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${track === '4hour' ? 'border-rose-600' : 'border-gray-300'}`}>
                        {track === '4hour' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">4-Hour Intensive</span>
                        <span className="text-sm text-gray-500">Complete training in one session</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTrack('2hour')}
                      className={`relative flex items-center p-4 rounded-xl border-2 transition-all text-left ${
                        track === '2hour' 
                          ? 'border-rose-600 bg-rose-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${track === '2hour' ? 'border-rose-600' : 'border-gray-300'}`}>
                        {track === '2hour' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">2-Hour Split Sessions</span>
                        <span className="text-sm text-gray-500">Two separate sessions (Part 1 + Part 2)</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Dynamic Scheduling Options */}
                {track === '4hour' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-2"
                  >
                    <label className="block text-sm font-medium text-gray-700">Select Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                      <select 
                        required 
                        value={selectedDateId}
                        onChange={(e) => setSelectedDateId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Choose a date...</option>
                        {SESSIONS.INTENSIVE.map(s => (
                          <option key={s.id} value={s.id}>
                            {formatLocalTime(s.iso)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {track === '2hour' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-6 pt-2"
                  >
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        <strong>Action Required:</strong> To complete the training, you must select dates for <u>both</u> Part 1 and Part 2.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Part 1 Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                        <select 
                          required 
                          value={part1Id}
                          onChange={(e) => setPart1Id(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Choose Part 1 date...</option>
                          {SESSIONS.PART1.map(s => (
                            <option key={s.id} value={s.id}>
                              {formatLocalTime(s.iso)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Part 2 Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
                        <select 
                          required 
                          value={part2Id}
                          onChange={(e) => setPart2Id(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Choose Part 2 date...</option>
                          {SESSIONS.PART2.map(s => (
                            <option key={s.id} value={s.id}>
                              {formatLocalTime(s.iso)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={track === 'none' || isSubmitting}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    By registering, you agree to our Code of Conduct and Privacy Policy.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
