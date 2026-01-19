
import React from 'react';
import { Loop } from '../types';

interface DashboardProps {
  loops: Loop[];
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ loops, onSelect, onEdit, onCreate }) => {
  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl serif font-bold text-stone-900">Your Circles</h2>
          <p className="text-stone-500 mt-2">Manage and view your private newsletters.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Loop
        </button>
      </div>

      {loops.length === 0 ? (
        <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl p-12 text-center">
          <p className="text-stone-500 mb-6">You haven't created any loops yet.</p>
          <button 
            onClick={onCreate}
            className="text-amber-600 font-semibold hover:underline"
          >
            Start your first one now &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loops.map(loop => (
            <div 
              key={loop.id}
              className="glass rounded-3xl overflow-hidden hover:shadow-xl transition-all border border-stone-100 group"
            >
              <div className="h-32 bg-stone-200 relative">
                {loop.headerImage ? (
                  <img src={loop.headerImage} className="w-full h-full object-cover opacity-80" alt={loop.name} />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(loop.category)} opacity-40`} />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute top-4 left-4 flex gap-2">
                   <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-stone-600 shadow-sm">
                    {loop.category}
                  </span>
                   <span className="bg-amber-600/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-white shadow-sm">
                    {loop.frequency}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl serif font-bold text-stone-900 mb-2">{loop.name}</h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">{loop.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center -space-x-2">
                    {loop.members.slice(0, 4).map(member => (
                      <img 
                        key={member.id} 
                        src={member.avatar} 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                        title={member.name}
                      />
                    ))}
                    {loop.members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-stone-500">
                        +{loop.members.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Next Edition</p>
                    <p className="text-[11px] font-semibold text-stone-600">
                      {loop.nextSendDate ? new Date(loop.nextSendDate).toLocaleDateString() : 'Set Schedule'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => onSelect(loop.id)}
                    className="flex-1 bg-stone-900 text-white py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
                  >
                    Manage Edition
                  </button>
                  <button 
                    onClick={() => onEdit(loop.id)}
                    className="px-3 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function getCategoryColor(category: string) {
  switch (category) {
    case 'family': return 'from-amber-200 to-orange-100';
    case 'friends': return 'from-indigo-200 to-blue-100';
    case 'work': return 'from-emerald-200 to-teal-100';
    default: return 'from-stone-200 to-stone-100';
  }
}

export default Dashboard;
