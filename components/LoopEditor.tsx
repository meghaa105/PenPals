
import React, { useState } from 'react';
import { Loop, Question, Member, Frequency } from '../types';
import { suggestQuestions } from '../services/geminiService';

interface LoopEditorProps {
  loop?: Loop;
  onSave: (loop: Loop) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const CATEGORIES = [
  { id: 'family', label: 'Family', icon: '🏠', color: 'amber' },
  { id: 'friends', label: 'Friends', icon: '🥂', color: 'indigo' },
  { id: 'work', label: 'Work', icon: '💼', color: 'emerald' },
  { id: 'other', label: 'Other', icon: '✨', color: 'stone' },
] as const;

const LoopEditor: React.FC<LoopEditorProps> = ({ loop, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState(loop?.name || '');
  const [description, setDescription] = useState(loop?.description || '');
  const [category, setCategory] = useState<Loop['category']>(loop?.category || 'family');
  const [frequency, setFrequency] = useState<Frequency>(loop?.frequency || 'monthly');
  const [questions, setQuestions] = useState<Question[]>(loop?.questions || []);
  const [members, setMembers] = useState<Member[]>(loop?.members || []);
  
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setQuestions([...questions, { id: Date.now().toString(), text: newQuestionText }]);
    setNewQuestionText('');
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName,
      email: newMemberEmail,
      avatar: `https://i.pravatar.cc/150?u=${newMemberEmail}`
    };
    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleAISuggest = async () => {
    setIsSuggesting(true);
    try {
      const suggestions = await suggestQuestions(category, description, questions.map(q => q.text));
      const newQuestions = suggestions.map(s => ({ id: Math.random().toString(36), text: s }));
      setQuestions([...questions, ...newQuestions]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: Loop = {
      id: loop?.id || Date.now().toString(),
      name,
      description,
      category,
      frequency,
      questions,
      members,
      responses: loop?.responses || [],
      lastGeneratedAt: loop?.lastGeneratedAt,
      headerImage: loop?.headerImage,
      introText: loop?.introText,
      nextSendDate: loop?.nextSendDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    onSave(result);
  };

  return (
    <div className="max-w-5xl mx-auto mb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <button 
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-800 flex items-center gap-2 text-sm font-bold mb-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Cancel and Return
          </button>
          <h2 className="text-5xl serif font-bold text-stone-900">{loop ? 'Refine your Loop' : 'Start a New Loop'}</h2>
        </div>
        {loop && onDelete && (
          <button 
            onClick={() => { if(confirm('Are you sure? This will delete all history for this loop.')) onDelete(loop.id) }}
            className="text-red-400 text-xs font-black uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            Delete Forever
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Section: Identity */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-8">
            <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-300">Identity & Purpose</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-stone-800 uppercase tracking-wider">Loop Name</label>
                <input 
                  required
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full text-3xl serif bg-transparent border-b-2 border-stone-100 focus:border-amber-500 outline-none pb-2 transition-colors placeholder:text-stone-200"
                  placeholder="e.g., The Midnight Society"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-stone-800 uppercase tracking-wider">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                        category === cat.id 
                        ? 'bg-stone-900 border-stone-900 text-white shadow-lg scale-105' 
                        : 'bg-stone-50 border-stone-100 text-stone-500 hover:border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-stone-800 uppercase tracking-wider">Group Description</label>
                <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full text-lg serif bg-stone-50/50 p-6 rounded-3xl border-none focus:ring-4 focus:ring-amber-500/10 outline-none transition-all min-h-[100px]"
                    placeholder="Tell Scribe what brings this group together. It helps the AI write better introductions."
                />
              </div>
            </div>
          </div>

          {/* Section: Delivery */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-8">
            <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-300">Rhythm & Timing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <label className="text-sm font-black text-stone-800 uppercase tracking-wider">How often?</label>
                 <div className="space-y-2">
                   {(['weekly', 'biweekly', 'monthly'] as Frequency[]).map(freq => (
                     <button
                       key={freq}
                       type="button"
                       onClick={() => setFrequency(freq)}
                       className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                         frequency === freq 
                         ? 'border-amber-500 bg-amber-50/50 text-amber-900 font-bold' 
                         : 'border-stone-100 text-stone-500 hover:border-stone-200'
                       }`}
                     >
                       <span className="capitalize">{freq}</span>
                       {frequency === freq && <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="p-8 bg-stone-50 rounded-[2rem] flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">Next Delivery</p>
                  <p className="text-stone-800 font-bold serif text-xl">Next Monday</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Members & Questions */}
        <div className="lg:col-span-5 space-y-12">
          
          {/* Section: People */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-300">The Circle ({members.length})</h3>
            </div>

            <div className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl group transition-all hover:bg-stone-100">
                    <img src={member.avatar} className="w-10 h-10 rounded-full grayscale hover:grayscale-0 transition-all" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-800 truncate">{member.name}</p>
                      <p className="text-[10px] text-stone-400 font-black uppercase tracking-wider truncate">{member.email}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-50 space-y-3">
                <input 
                  type="text" 
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-stone-200 outline-none text-sm font-medium"
                  placeholder="Full Name"
                />
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    value={newMemberEmail}
                    onChange={e => setNewMemberEmail(e.target.value)}
                    className="flex-1 px-5 py-3 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-stone-200 outline-none text-sm font-medium"
                    placeholder="Email Address"
                  />
                  <button 
                    type="button"
                    onClick={handleAddMember}
                    className="bg-stone-900 text-white px-6 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-stone-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Discussion */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-[0.3em] font-black text-stone-300">Prompting</h3>
              <button 
                type="button"
                onClick={handleAISuggest}
                disabled={isSuggesting}
                className="text-amber-600 text-[10px] font-black uppercase tracking-widest hover:text-amber-700 disabled:opacity-50 flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full transition-all hover:scale-105"
              >
                {isSuggesting ? 'Thinking...' : '✨ AI Assist'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 scrollbar-hide">
                {questions.map((q, idx) => (
                  <div key={q.id} className="group relative flex gap-4 bg-stone-50 p-5 rounded-3xl border border-transparent hover:border-amber-100 hover:bg-white transition-all">
                    <span className="text-[10px] font-black text-stone-200 pt-1">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-sm text-stone-700 font-medium leading-relaxed flex-1">{q.text}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="text-stone-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all pt-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative pt-4">
                <input 
                  type="text" 
                  value={newQuestionText}
                  onChange={e => setNewQuestionText(e.target.value)}
                  className="w-full pl-6 pr-16 py-4 rounded-3xl bg-stone-50 border-none focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm font-medium"
                  placeholder="Type a new prompt..."
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
                />
                <button 
                  type="button"
                  onClick={handleAddQuestion}
                  className="absolute right-3 top-[calc(1rem+4px)] text-amber-600 hover:text-amber-700 font-black p-1 transition-transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Button - Floating or Sticky */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-6">
          <button 
            type="submit"
            className="w-full bg-stone-900 text-white py-6 rounded-full font-black text-xl hover:bg-stone-800 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:translate-y-0"
          >
            Save Loop Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoopEditor;
