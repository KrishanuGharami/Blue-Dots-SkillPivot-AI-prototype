'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, ArrowRight, ShieldCheck, Database, Award, HelpCircle, Sparkles, Zap, Flame } from 'lucide-react';
import UserPersonasSection from '@/components/UserPersonasSection';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#070b13] flex flex-col justify-between overflow-hidden">
      
      {/* Decorative gradient backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full filter blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '9s' }} />

      {/* Top Navigation */}
      <header className="relative z-10 px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/10">
            S
          </div>
          <span className="font-bold tracking-tight text-slate-100 text-lg">SkillPivot <span className="text-cyan-400">AI</span></span>
        </div>
        <div className="hidden sm:flex items-center space-x-6 text-sm text-slate-400 font-medium">
          <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
          <a href="#challenge" className="hover:text-slate-100 transition-colors">Challenge Info</a>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-sm text-slate-200 hover:text-white font-semibold transition-all"
        >
          Launch Simulator
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-5xl mx-auto">
        
        {/* Challenge badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-semibold tracking-wider uppercase mb-6 animate-fadeInUp">
          <Award size={12} />
          <span>Blue Dots Economy Market Discovery Challenge</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6 animate-fadeInUp">
          AI Voice Agent for <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">Market Discovery</span> & Lead Capture
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-8 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          Discover visitor demographics, target career objectives, and technology learning barriers in seconds. Connect directly to the Gemini Live API for a structured, compliant conversation.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <Link
            href="/dashboard"
            className="flex items-center justify-center space-x-2.5 py-4 px-8 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/15 hover:scale-[1.03] active:scale-[0.98] transition-all w-full sm:w-auto group"
          >
            <Mic size={18} />
            <span>Launch Live Agent</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="flex items-center justify-center py-4 px-8 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl transition-all w-full sm:w-auto"
          >
            Explore Features
          </a>
        </div>

        {/* Dashboard Preview mockup card */}
        <div id="preview" className="w-full mt-16 rounded-2xl border border-slate-800 bg-slate-950/40 p-1.5 shadow-2xl animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <div className="rounded-xl overflow-hidden border border-slate-900 bg-slate-900/60 p-4 aspect-[16/9] flex items-center justify-center relative">
            
            {/* Simulation decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-400/20 animate-ping absolute" style={{ animationDuration: '3s' }} />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 relative cursor-pointer">
                <Mic size={30} className="animate-bounce" />
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>PROFILING ENGINE: LIVE</span>
              <span>COMPLIANCE STATUS: PASSED</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <section id="features" className="w-full mt-24 py-12 border-t border-slate-900 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Full Feature Specifications</h2>
            <p className="text-sm text-slate-400">Everything needed for a production-quality deployment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit">
                <Mic size={18} />
              </div>
              <h3 className="font-semibold text-slate-200 text-base">One-Click Voice Dialogue</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect the microphone with a single tap. Supports real-time text-to-speech feedback and visual voice wave animations.
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit">
                <Database size={18} />
              </div>
              <h3 className="font-semibold text-slate-200 text-base">Progressive Profiling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Branching paths collect specific details based on user type (student career goals vs. college student capacity and budget).
              </p>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-semibold text-slate-200 text-base">Compliance Monitoring</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audits replies to ensure they remain under two sentences and avoid forbidden words (*guaranteed, 100%, best, revolutionary*).
              </p>
            </div>
          </div>
        </section>

        {/* User Personas Section */}
        <UserPersonasSection />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900/80 bg-slate-950/40 py-8 text-center text-xs text-slate-500 px-6">
        <p className="max-w-xl mx-auto">
          SkillPivot AI discovery portal built for the Market Discovery Challenge. Underpinned by Google Gemini LLM and Firebase Firestore.
        </p>
      </footer>
    </div>
  );
}
