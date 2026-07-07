'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AIMarketDiscoverySection from '@/components/AIMarketDiscoverySection';

export default function MapPage() {
  return (
    <div className="relative min-h-screen bg-[#070b13] flex flex-col justify-between overflow-hidden">
      
      {/* Decorative gradient backgrounds matching landing page */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full filter blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '9s' }} />

      {/* Top Navigation */}
      <header className="relative z-10 px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform duration-300">
            S
          </div>
          <span className="font-bold tracking-tight text-slate-100 text-lg">SkillPivot <span className="text-cyan-400">AI</span></span>
        </Link>
        <div className="hidden sm:flex items-center space-x-6 text-sm font-medium">
          <Link href="/#features" className="text-slate-400 hover:text-slate-100 transition-colors">
            Features
          </Link>
          <span className="text-cyan-400 border-b-2 border-cyan-500 pb-1 font-semibold text-sm">
            Map
          </span>
          <Link href="/#challenge" className="text-slate-400 hover:text-slate-100 transition-colors">
            Challenge Info
          </Link>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-sm text-slate-200 hover:text-white font-semibold transition-all"
        >
          Launch Simulator
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full flex flex-col justify-start">
        
        {/* Back navigation helper banner */}
        <div className="max-w-7xl mx-auto w-full px-6 pt-4 pb-2">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to landing page</span>
          </Link>
        </div>

        {/* AI Market Discovery Flagship Section */}
        <div className="w-full flex-1">
          <AIMarketDiscoverySection />
        </div>
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
