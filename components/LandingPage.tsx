
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onExample: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExample }) => {
  return (
    <div className="relative min-h-screen bg-[#fcfbf7] overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        <h1 className="text-6xl md:text-8xl serif font-bold text-stone-900 mb-8 leading-tight">
          The private <br />
          <span className="italic text-amber-700">newsletter</span> for<br />
          your inner circle.
        </h1>
        <p className="text-xl md:text-2xl text-stone-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Reconnect with the people who matter most. Scribe uses AI to help you ask better questions and weaves your group's responses into beautiful weekly stories.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button 
            onClick={onStart}
            className="px-10 py-5 bg-stone-900 text-white rounded-full text-lg font-semibold hover:bg-stone-800 transition-all transform hover:scale-105 shadow-xl"
          >
            Start your Scribe
          </button>
          <button 
            onClick={onExample}
            className="px-10 py-5 bg-white text-stone-800 rounded-full text-lg font-medium border border-stone-200 hover:bg-stone-50 transition-all"
          >
            See an example
          </button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          <div className="glass p-8 rounded-3xl">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-3">Meaningful Questions</h3>
            <p className="text-stone-600 leading-relaxed">AI suggests deep, engaging questions that spark real conversation beyond "how was your day?"</p>
          </div>
          <div className="glass p-8 rounded-3xl">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-3">Beautiful Stories</h3>
            <p className="text-stone-600 leading-relaxed">Every week, Scribe curates responses into a magazine-quality digital layout for everyone to read.</p>
          </div>
          <div className="glass p-8 rounded-3xl">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-3">Completely Private</h3>
            <p className="text-stone-600 leading-relaxed">No ads, no public profiles, no feeds. Just a safe space for your family and closest friends.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
