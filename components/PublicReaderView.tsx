
import React from 'react';
import { Loop } from '../types';

interface PublicReaderViewProps {
  loop: Loop;
  onBackToApp: () => void;
}

const PublicReaderView: React.FC<PublicReaderViewProps> = ({ loop, onBackToApp }) => {
  const getResponsesByQuestion = () => {
    const map: Record<string, { q: string, r: { name: string, avatar: string, text: string }[] }> = {};
    loop.questions.forEach(q => {
      map[q.id] = { q: q.text, r: [] };
    });
    loop.responses.forEach(r => {
      if (map[r.questionId]) {
        const member = loop.members.find(m => m.id === r.memberId);
        if (member) {
          map[r.questionId].r.push({ name: member.name, avatar: member.avatar, text: r.answer });
        }
      }
    });
    return Object.values(map).filter(item => item.r.length > 0);
  };

  const groupedResponses = getResponsesByQuestion();

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <nav className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="text-2xl serif font-bold text-stone-900">Scribe<span className="text-amber-600">.</span></div>
        <button onClick={onBackToApp} className="text-xs font-bold text-stone-400 hover:text-stone-900 uppercase tracking-widest transition-colors">Return to Dashboard</button>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white shadow-2xl rounded-[3rem] overflow-hidden border border-stone-100">
          <div className="relative h-[450px]">
            {loop.headerImage ? (
              <img src={loop.headerImage} className="w-full h-full object-cover" alt="Header" />
            ) : (
              <div className="w-full h-full bg-stone-200 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <h1 className="text-5xl serif font-bold mb-4">{loop.name}</h1>
              <p className="text-white/80 italic font-serif">
                {loop.lastGeneratedAt ? new Date(loop.lastGeneratedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent Edition'}
              </p>
            </div>
          </div>

          <div className="p-12 md:p-24 space-y-32">
            <div className="max-w-2xl relative">
              <span className="text-amber-500/10 font-serif text-[15rem] absolute -top-32 -left-12 select-none">“</span>
              <p className="text-2xl text-stone-700 leading-relaxed italic serif relative z-10">
                {loop.introText || "Welcome to our circle. Here's a look at what everyone's been up to."}
              </p>
            </div>

            <div className="space-y-32">
              {groupedResponses.map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-3xl serif font-bold text-stone-900 mb-12 border-b border-stone-100 pb-6">
                    {item.q}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {item.r.map((resp, ridx) => (
                      <div key={ridx} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <img src={resp.avatar} className="w-10 h-10 rounded-full" />
                          <span className="text-sm font-black text-stone-900 uppercase tracking-widest">{resp.name}</span>
                        </div>
                        <p className="text-lg text-stone-600 leading-relaxed font-serif">
                          {resp.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-20">
               <p className="text-stone-300 font-bold uppercase tracking-[0.4em] text-[10px]">End of Edition</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicReaderView;
