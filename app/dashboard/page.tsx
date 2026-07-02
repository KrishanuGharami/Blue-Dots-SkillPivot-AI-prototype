'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authActions } from '../../lib/firebase';
import { useVoiceAgent } from '../../hooks/useVoiceAgent';
import VoiceAgent from '../../components/VoiceAgent';
import LiveStateTracker from '../../components/LiveStateTracker';
import ComplianceMonitor from '../../components/ComplianceMonitor';
import ProfileSelector from '../../components/ProfileSelector';
import HistoryList from '../../components/HistoryList';
import { LogOut, User, Activity, Globe } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  
  const agent = useVoiceAgent();

  // Redirect to login if not authenticated
  useEffect(() => {
    const unsubscribe = authActions.onAuthChange((u) => {
      setUser(u);
      setAuthLoading(false);
      if (!u) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Clean speaking on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);



  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
    await authActions.signOutUser();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070b13] space-y-4">
        <div className="w-10 h-10 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin" />
        <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Verifying Session Credentials...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Speak helper for the Profile Preset loader
  const speakTextHelper = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    if (!agent.speechEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => 
      v.name.includes("Google US English") || 
      v.name.includes("Microsoft Zira") || 
      v.lang.startsWith("en-US")
    );
    if (premiumVoice) utterance.voice = premiumVoice;
    
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col pb-12">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-cyan-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-12 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/10">
              S
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm md:text-base leading-none">SkillPivot AI Portal</h1>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">Blue Dots Challenge Simulator</span>
            </div>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="hidden sm:flex items-center space-x-2 text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <User size={13} className="text-cyan-400" />
              <span>{user.email || 'guest@skillpivot.ai'}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 flex-1">
        
        {/* Left Column: Voice Agent Controller */}
        <div className="lg:col-span-6 flex flex-col">
          <VoiceAgent
            currentState={agent.currentState}
            structuredState={agent.structuredState}
            transcript={agent.transcript}
            isListening={agent.isListening}
            isSpeaking={agent.isSpeaking}
            isLoading={agent.isLoading}
            audioEnabled={agent.audioEnabled}
            speechEnabled={agent.speechEnabled}
            errorMsg={agent.errorMsg}
            setAudioEnabled={agent.setAudioEnabled}
            setSpeechEnabled={agent.setSpeechEnabled}
            startListening={agent.startListening}
            stopListening={agent.stopListening}
            submitMessage={agent.submitMessage}
            resetAgent={agent.resetAgent}
            startAgent={agent.startAgent}
          />
        </div>

        {/* Right Column: Monitors, State Trackers, History */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          
          {/* Top segment: State Tracker & Profile Presets */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 h-[380px]">
              <LiveStateTracker structuredState={agent.structuredState} />
            </div>
            <div className="md:col-span-5 flex flex-col space-y-6">
              <ComplianceMonitor audit={agent.complianceAudit} />
              <ProfileSelector
                submitMessage={agent.submitMessage}
                resetAgent={agent.resetAgent}
                setStructuredState={agent.setStructuredState}
                setCurrentState={agent.setCurrentState}
                setTranscript={agent.setTranscript}
                speakText={speakTextHelper}
              />
            </div>
          </div>

          {/* Bottom segment: Saved history logs */}
          <div>
            <HistoryList />
          </div>

        </div>

      </main>
    </div>
  );
}
