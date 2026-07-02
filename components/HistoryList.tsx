'use client';

import React, { useEffect, useState } from 'react';
import { History, Calendar, User, ChevronDown, ChevronUp, Clock, FileJson, ArrowRight } from 'lucide-react';
import { loadConversationSessions, FirebaseSession, authActions } from '../lib/firebase';

export default function HistoryList() {
  const [sessions, setSessions] = useState<FirebaseSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Monitor Auth State
    const unsubscribe = authActions.onAuthChange((u) => {
      setUser(u);
      if (u) {
        fetchHistory(u.uid);
      } else {
        setSessions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (uid: string) => {
    setLoading(true);
    try {
      const list = await loadConversationSessions(uid);
      setSessions(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string | undefined) => {
    if (!id) return;
    setExpandedId(expandedId === id ? null : id);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      return isoString;
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 h-[250px]">
        <History size={28} className="text-slate-500" />
        <div>
          <h4 className="text-sm font-semibold text-slate-200">Conversation History Locked</h4>
          <p className="text-xs text-slate-400 max-w-[250px] mx-auto mt-1 leading-relaxed">
            Please log in or enter guest mode to view and track your session history database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <History size={18} className="text-cyan-400" />
          <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-none">Conversation History</h3>
        </div>
        <button
          onClick={() => fetchHistory(user.uid)}
          className="text-[10px] text-cyan-400 font-mono hover:underline uppercase font-bold"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
          Loading previous sessions from database...
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 italic">
          No previous sessions captured. Run a full discovery session to save it to history!
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
          {sessions.map((session) => {
            const isExpanded = expandedId === session.id;
            const state = session.structuredState;
            const userTypeText = state.userType || 'Unspecified';

            return (
              <div
                key={session.id}
                className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300"
              >
                {/* Session Summary Row */}
                <div
                  onClick={() => toggleExpand(session.id)}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-800/20 transition-all select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        userTypeText === 'Student'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25'
                          : userTypeText === 'College'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {userTypeText}
                      </span>
                      <span className="text-[11px] font-medium text-slate-300">
                        {state.leadCaptured?.name || 'Anonymous Lead'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-[10px] text-slate-500 space-x-2.5">
                      <span className="flex items-center space-x-1">
                        <Clock size={10} />
                        <span>{formatTime(session.timestamp)}</span>
                      </span>
                      {state.intent && (
                        <span className="truncate max-w-[150px] md:max-w-[220px] text-[10px] text-cyan-500/80 font-mono">
                          {state.intent.split('|').pop()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Session Logs */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-900/60 bg-slate-950/20 space-y-4 pt-3 animate-fadeIn">
                    
                    {/* Capture Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="text-slate-500 uppercase font-bold text-[9px] block mb-0.5">Demographics / Goal</span>
                        <span className="text-slate-200 block truncate">{state.goal || 'Not captured'}</span>
                      </div>
                      <div className="p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="text-slate-500 uppercase font-bold text-[9px] block mb-0.5">Interests / Focus</span>
                        <span className="text-slate-200 block truncate">{state.interest || 'Not captured'}</span>
                      </div>
                      <div className="p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="text-slate-500 uppercase font-bold text-[9px] block mb-0.5">Barriers / Pain Points</span>
                        <span className="text-slate-200 block truncate">{state.painPoint || 'Not captured'}</span>
                      </div>
                      <div className="p-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="text-slate-500 uppercase font-bold text-[9px] block mb-0.5">Contact Method</span>
                        <span className="text-slate-200 block truncate">{state.leadCaptured?.phone || 'Not captured'}</span>
                      </div>
                    </div>

                    {/* Miniature transcript log */}
                    <div className="space-y-1">
                      <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">Full Trial Dialog Transcript</span>
                      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 max-h-[140px] overflow-y-auto text-[11px] space-y-2.5 custom-scrollbar font-sans">
                        {session.transcript?.map((t, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <span className={`font-mono text-[9px] font-bold block ${t.sender === 'user' ? 'text-cyan-400' : 'text-slate-500'}`}>
                              {t.sender === 'user' ? 'User' : 'Agent'}
                            </span>
                            <p className="text-slate-300 leading-relaxed">{t.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
