
import React, { useState } from 'react';
import { Loop, Question, Member, Frequency } from '../types';
import { suggestQuestions } from '../services/geminiService';

interface LoopEditorProps {
  loop?: Loop;
  onSave: (loop: Loop) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

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

  // Fix: Added handleRemoveQuestion to allow removing questions from the list
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
    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] border border-stone-200 shadow-xl overflow-hidden mb-20">
      <div className="p-8 md:p-12 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
        <div>
          <h2 className="text-3xl serif font-bold text-stone-900">{loop ? 'Edit Loop' : 'Create New Loop'}</h2>
          <p className="text-stone-500 mt-1">Configure how your private circle operates.</p>
        </div>
        {loop && onDelete && (
          <button 
            onClick={() => onDelete(loop.id)}
            className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
          >
            Delete Loop
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
        <section className="space-y-6">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Loop Name</label>
              <input 
                required
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                placeholder="e.g., The Family Bulletin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none bg-white"
              >
                <option value="family">Family</option>
                <option value="friends">Friends</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Sending Frequency</label>
              <select 
                value={frequency}
                onChange={e => setFrequency(e.target.value as any)}
                className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none bg-white"
              >
                <option value="weekly">Every Week</option>
                <option value="biweekly">Every Two Weeks</option>
                <option value="monthly">Every Month</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700">Group Description</label>
              <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                  rows={1}
                  placeholder="What brings this group together?"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">Members ({members.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map(member => (
              <div key={member.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100 group">
                <img src={member.avatar} className="w-10 h-10 rounded-full" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-stone-800 text-sm truncate">{member.name}</p>
                  <p className="text-stone-400 text-xs truncate">{member.email}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="p-4 border-2 border-dashed border-stone-200 rounded-2xl space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 text-xs outline-none"
                  placeholder="Full Name"
                />
                <input 
                  type="email" 
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 text-xs outline-none"
                  placeholder="Email Address"
                />
              </div>
              <button 
                type="button"
                onClick={handleAddMember}
                className="w-full py-2 bg-stone-800 text-white rounded-lg text-xs font-bold hover:bg-stone-700 transition-colors"
              >
                Add Member to Circle
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-stone-400">Discussion Questions</h3>
            <button 
              type="button"
              onClick={handleAISuggest}
              disabled={isSuggesting}
              className="text-amber-600 text-xs font-bold hover:text-amber-700 disabled:opacity-50 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full"
            >
              {isSuggesting ? 'Generating...' : '✨ Suggest with AI'}
            </button>
          </div>
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="flex gap-4 items-center bg-stone-50 p-4 rounded-2xl border border-stone-100 group">
                <span className="flex-1 text-sm text-stone-700 font-medium">{q.text}</span>
                <button 
                  type="button"
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newQuestionText}
                onChange={e => setNewQuestionText(e.target.value)}
                className="flex-1 px-5 py-3 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-sm"
                placeholder="Add your own question..."
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
              />
              <button 
                type="button"
                onClick={handleAddQuestion}
                className="bg-stone-100 text-stone-700 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-stone-200 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </section>

        <div className="pt-8 flex flex-col md:flex-row gap-4 border-t border-stone-100">
          <button 
            type="submit"
            className="flex-1 bg-stone-900 text-white py-5 rounded-full font-bold hover:bg-stone-800 transition-all shadow-xl text-lg"
          >
            Save Circle Settings
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-12 py-5 text-stone-500 font-bold hover:text-stone-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoopEditor;
