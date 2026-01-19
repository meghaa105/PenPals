
import React, { useState } from 'react';
import { Loop, Member, Response } from '../types';

interface PublicRespondViewProps {
  loop: Loop;
  onSubmit: (response: Response) => void;
  onBackToApp: () => void;
}

const PublicRespondView: React.FC<PublicRespondViewProps> = ({ loop, onSubmit, onBackToApp }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (qId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleFinalSubmit = () => {
    if (!selectedMemberId) return;

    // Fix: Explicitly treat 'text' as string to resolve 'unknown' type error for .trim()
    Object.entries(answers).forEach(([qId, text]) => {
      const answerText = text as string;
      if (answerText.trim()) {
        onSubmit({
          id: Math.random().toString(36),
          memberId: selectedMemberId,
          questionId: qId,
          answer: answerText
        });
      }
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl serif font-bold text-stone-900 mb-4">Thanks for sharing!</h2>
          <p className="text-stone-500 mb-8">Your answers have been added to {loop.name}. They will appear in the next edition.</p>
          <button onClick={onBackToApp} className="text-amber-600 font-bold hover:underline">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <div className="text-2xl serif font-bold text-stone-900 mb-2">Scribe<span className="text-amber-600">.</span></div>
          <p className="text-stone-500 uppercase tracking-widest text-[10px] font-black">Response Collection</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-stone-100">
          <h1 className="text-4xl serif font-bold text-stone-900 mb-4">Share your week</h1>
          <p className="text-stone-500 mb-12">Take a moment to catch up with the {loop.name} circle.</p>

          <div className="space-y-12">
            <section className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-stone-400">Who is answering?</label>
              <select 
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                className="w-full p-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-amber-500/10 outline-none"
              >
                <option value="">Select your name...</option>
                {loop.members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </section>

            {loop.questions.map((q, idx) => (
              <section key={q.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                <label className="text-xl serif font-bold text-stone-800">{q.text}</label>
                <textarea 
                  value={answers[q.id] || ''}
                  onChange={e => handleAnswerChange(q.id, e.target.value)}
                  className="w-full p-6 rounded-2xl bg-stone-50 border-none focus:ring-4 focus:ring-amber-500/10 outline-none min-h-[150px] text-lg font-serif"
                  placeholder="Type your response..."
                />
              </section>
            ))}

            <button 
              onClick={handleFinalSubmit}
              // Fix: Explicitly treat 'a' as string to resolve 'unknown' type error for .trim()
              disabled={!selectedMemberId || Object.values(answers).every(a => !(a as string).trim())}
              className="w-full bg-stone-900 text-white py-6 rounded-full font-black text-xl hover:bg-stone-800 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
              Submit to {loop.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicRespondView;
