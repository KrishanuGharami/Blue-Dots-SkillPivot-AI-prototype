'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authActions } from '../../lib/firebase';
import { KeyRound, Mail, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = authActions.onAuthChange((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const emailToUse = email.trim() || 'guest@skillpivot.ai';
      await authActions.loginGuest(emailToUse);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to authenticate. Running in offline mock backup.');
      // Auto-fallback bypass for robust testing
      setTimeout(() => router.push('/dashboard'), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070b13] flex items-center justify-center p-6 overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Form Container */}
      <div className="w-full max-w-md relative z-10 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/10 mx-auto text-lg">
            S
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Access Discovery Portal</h2>
          <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
            Enter your details to track and log your live conversation history.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleGuestLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email Address (Optional)</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guest@skillpivot.ai"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 text-slate-100 text-sm pl-11 pr-4 py-3 rounded-xl outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all shadow-md shadow-cyan-500/10 disabled:opacity-50"
          >
            <UserCheck size={16} />
            <span>{loading ? 'Authenticating...' : 'Enter as Guest / Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase font-bold tracking-widest font-mono">Sandbox Mode</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Testing instructions details */}
        <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2 text-[11px] text-slate-400 leading-relaxed">
          <div className="flex items-center space-x-1.5 font-semibold text-slate-300">
            <Sparkles size={12} className="text-amber-400" />
            <span>Developer Note:</span>
          </div>
          <p>
            No passwords are required. Submitting this form automatically creates or hooks into a sandbox session (backed by Firebase in live mode or local cache in mock mode).
          </p>
        </div>

      </div>
    </div>
  );
}
