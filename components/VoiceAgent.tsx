'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Send, RotateCcw, Volume2, VolumeX, MessageSquare, PhoneCall, Calendar, AlertCircle } from 'lucide-react';
import { ConversationState, StructuredState } from '../lib/stateMachine';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: number;
}

interface VoiceAgentProps {
  currentState: ConversationState;
  structuredState: StructuredState;
  transcript: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  audioEnabled: boolean;
  speechEnabled: boolean;
  errorMsg: string | null;
  setAudioEnabled: (val: boolean) => void;
  setSpeechEnabled: (val: boolean) => void;
  startListening: () => void;
  stopListening: () => void;
  submitMessage: (text: string) => void;
  resetAgent: () => void;
  startAgent: (persona?: 'Student' | 'College' | 'Professional') => void;
}

export default function VoiceAgent({
  currentState,
  structuredState,
  transcript,
  isListening,
  isSpeaking,
  isLoading,
  audioEnabled,
  speechEnabled,
  errorMsg,
  setAudioEnabled,
  setSpeechEnabled,
  startListening,
  stopListening,
  submitMessage,
  resetAgent,
  startAgent,
}: VoiceAgentProps) {
  const [textInput, setTextInput] = useState('');
  const [urlPersona, setUrlPersona] = useState<'Student' | 'College' | 'Professional' | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Read URL search parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const persona = params.get('persona');
    if (persona) {
      const mapped = persona === 'student' ? 'Student' : 
                     persona === 'college' ? 'College' : 
                     persona === 'professional' ? 'Professional' : null;
      setUrlPersona(mapped);
    }
  }, []);

  // Auto-scroll transcript to bottom on new messages
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, isLoading]);

  // Handle typing submission
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    submitMessage(textInput);
    setTextInput('');
  };

  const handleStartSession = () => {
    if (urlPersona) {
      startAgent(urlPersona);
    } else {
      startAgent();
    }
  };

  const isCompleted = currentState === ConversationState.COMPLETED;
  const isFinished = currentState === ConversationState.FINISH;

  return (
    <div className="flex flex-col h-[650px] bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute" />
          <div className="w-3 h-3 rounded-full bg-cyan-400 relative" />
          <div>
            <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-none">Voice Discovery Agent</h3>
            <span className="text-[11px] text-cyan-400 font-mono tracking-wider uppercase">
              {currentState === ConversationState.START ? 'Ready to Start' : currentState}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-lg transition-colors border ${
              speechEnabled
                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
            title={speechEnabled ? "Mute Voice Response" : "Unmute Voice Response"}
          >
            {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          <button
            onClick={resetAgent}
            className="p-2 rounded-lg bg-slate-850 border border-slate-700/60 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main transcript scroll area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {transcript.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-pulse">
              <MessageSquare size={36} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-100 mb-2">
                {urlPersona ? `Connect SkillPivot AI for ${urlPersona}s` : 'Connect SkillPivot AI Voice Agent'}
              </h4>
              <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                {urlPersona 
                  ? `Activate the Voice AI discovery guide to start your personalized ${urlPersona} roadmap.`
                  : 'Start a live one-click voice discovery to determine your hands-on laboratory recommendation.'}
              </p>
            </div>
            <button
              onClick={handleStartSession}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer outline-none"
            >
              {urlPersona ? `Start ${urlPersona} Voice Discovery` : 'Start One-Click Discovery'}
            </button>
          </div>
        ) : (
          transcript.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1 animate-fadeIn`}
            >
              <span className="text-[10px] text-slate-500 px-2 uppercase font-semibold font-mono">
                {msg.sender === 'bot' ? 'SkillPivot AI' : 'You'}
              </span>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl leading-relaxed text-sm shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-tr-none'
                    : 'bg-slate-800/80 border border-slate-700/40 text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}

        {/* Loading typing state */}
        {isLoading && (
          <div className="flex flex-col items-start space-y-1 animate-fadeIn">
            <span className="text-[10px] text-slate-500 px-2 uppercase font-semibold font-mono">
              SkillPivot AI
            </span>
            <div className="bg-slate-800/80 border border-slate-700/40 px-5 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Direct CTA Buttons on Complete */}
        {(isFinished || isCompleted) && (
          <div className="flex flex-col space-y-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl animate-fadeInUp mt-4">
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider text-center">
              Next Steps Recommended
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href={process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
              >
                <Calendar size={16} />
                <span>Schedule Live Demo</span>
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919000000000"}?text=Hi!%20I%20just%20finished%20the%20SkillPivot%20Discovery%20and%20am%20interested%20in%20learning%20more.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-100 text-sm font-semibold rounded-xl transition-all"
              >
                <PhoneCall size={16} className="text-emerald-400" />
                <span>Connect via WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="px-6 py-2 bg-rose-500/10 border-t border-rose-500/20 flex items-center space-x-2 text-rose-400 text-xs animate-fadeIn">
          <AlertCircle size={14} className="shrink-0" />
          <span className="truncate">{errorMsg}</span>
        </div>
      )}

      {/* Voice visualizer and input controller */}
      {transcript.length > 0 && (
        <div className="px-6 py-5 border-t border-slate-800 bg-slate-950/80 flex flex-col space-y-4">
          
          {/* Animated wave bars when AI is speaking or Mic is listening */}
          <div className="flex items-center justify-between">
            
            {/* Listening Wave Visualizer */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium">
                {isListening ? 'Listening to you...' : isSpeaking ? 'Agent speaking...' : 'Voice input standby'}
              </span>
              {(isListening || isSpeaking) && (
                <div className="flex items-end space-x-[3px] h-[16px]">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-[3px] rounded-full bg-cyan-400 ${
                        isListening ? 'animate-voiceWave' : 'animate-voiceWaveSlow'
                      }`}
                      style={{
                        animationDelay: `${i * 120}ms`,
                        height: isListening ? '100%' : '60%'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Microphone Toggle Button */}
            {!isCompleted && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-semibold text-xs transition-all shadow-md ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white hover:scale-[1.02]'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff size={14} />
                    <span>Stop Mic</span>
                  </>
                ) : (
                  <>
                    <Mic size={14} />
                    <span>Speak Response</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Form manual input bar */}
          {!isCompleted && (
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your response here..."
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-cyan-500 text-slate-100 text-sm px-4 py-2.5 rounded-xl outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-40 disabled:hover:bg-cyan-500/10 transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          )}

        </div>
      )}
    </div>
  );
}
