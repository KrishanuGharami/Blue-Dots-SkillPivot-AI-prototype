import { useState, useEffect, useRef } from 'react';
import { ConversationState, StructuredState, ComplianceAudit, createDefaultState, checkCompliance, checkHandoffRequest } from '../lib/stateMachine';
import { saveConversationSession, authActions } from '../lib/firebase';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: number;
}

export function useVoiceAgent() {
  const [currentState, setCurrentState] = useState<ConversationState>(ConversationState.START);
  const currentStateRef = useRef<ConversationState>(currentState);
  currentStateRef.current = currentState;
  const [structuredState, setStructuredState] = useState<StructuredState>(createDefaultState());
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [complianceAudit, setComplianceAudit] = useState<ComplianceAudit | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stuckCountRef = useRef<number>(0);

  const handleHandoff = async (userMsg: Message) => {
    stuckCountRef.current = 0;
    const handoffReply = "I understand. I am handing you over to a student coordinator. Our team will contact you within 24 hours to help.";
    
    setCurrentState(ConversationState.FINISH);
    
    const botMsg: Message = { sender: 'bot', text: handoffReply, timestamp: Date.now() };
    setTranscript(prev => [...prev, botMsg]);
    setIsLoading(false);
    playPop();
    speakText(handoffReply);

    // Save to Firestore
    const user = authActions.getCurrentUser();
    if (user) {
      const updatedState = {
        ...structuredState,
        intent: (structuredState.intent || '') + " | Human Handoff Triggered"
      };
      setStructuredState(updatedState);
      
      await saveConversationSession({
        userId: user.uid,
        userEmail: user.email || 'guest@skillpivot.ai',
        structuredState: updatedState,
        transcript: [...transcript, userMsg, botMsg]
      }).catch(console.error);
    }
  };

  // Play interface sounds using native Web Audio API (copied from app.js)
  const initAudio = () => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playTick = () => {
    if (!audioEnabled) return;
    initAudio();
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.log('Audio autoplay blocked or unsupported.');
    }
  };

  const playPop = () => {
    if (!audioEnabled) return;
    initAudio();
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.log('Audio autoplay blocked.');
    }
  };

  const playSuccess = () => {
    if (!audioEnabled) return;
    initAudio();
    try {
      const ctx = audioContextRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, now + start);
        gain.gain.setValueAtTime(0.05, now + start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
        osc.start(now + start);
        osc.stop(now + start + duration);
      };
      playNote(523.25, 0, 0.1); // C5
      playNote(659.25, 0.08, 0.1); // E5
      playNote(783.99, 0.16, 0.25); // G5
    } catch (e) {
      console.log('Audio autoplay blocked.');
    }
  };

  // Text-To-Speech (TTS)
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();
    
    if (!speechEnabled) return;

    // Split text and remove forbidden words manually if they slip in
    const audit = checkCompliance(text);
    setComplianceAudit(audit);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to set a friendly female voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => 
      v.name.includes("Google US English") || 
      v.name.includes("Microsoft Zira") || 
      v.lang.startsWith("en-US")
    );
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }
    
    utterance.rate = 1.05;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-start listening again if the flow is not completed/finished
      if (currentStateRef.current !== ConversationState.COMPLETED && currentStateRef.current !== ConversationState.FINISH) {
        startListening();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.error("SpeechSynthesis error:", e);
      }
      setIsSpeaking(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
          setErrorMsg(null);
          playTick();
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setIsListening(false);
          submitMessage(resultText);
        };

        rec.onerror = (event: any) => {
          setIsListening(false);
          const errorType = event.error;
          if (errorType === 'not-allowed') {
            setErrorMsg("Microphone access is blocked. Please allow microphone access in your browser settings.");
          } else if (errorType === 'no-speech') {
            // Silence is normal, no errorMsg needed
          } else if (errorType === 'aborted') {
            // Aborted is normal, no errorMsg needed
          } else if (errorType === 'audio-capture') {
            setErrorMsg("No microphone was detected. Please ensure your microphone is plugged in and enabled.");
          } else {
            console.error("SpeechRecognition error:", errorType);
            setErrorMsg(`Voice input failed: ${errorType}. You can retry or type below.`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }

    // Clean up Speech on unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentState]);

  const startListening = async () => {
    if (recognitionRef.current) {
      try {
        window.speechSynthesis.cancel(); // Stop AI speaking if user wants to barge in
        setIsSpeaking(false);
        setErrorMsg(null);

        // Pre-verify and request microphone permissions via getUserMedia
        if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Close stream immediately so the browser mic indicator goes away
            stream.getTracks().forEach(track => track.stop());
          } catch (err: any) {
            console.warn("Microphone access denied or not available:", err);
            setErrorMsg("Microphone access is blocked. Please allow microphone access in your browser settings to speak.");
            setIsListening(false);
            return;
          }
        }

        recognitionRef.current.start();
      } catch (e) {
        // Recognition already running or blocked
      }
    } else {
      setErrorMsg("Voice recognition is not supported in this browser. Please type your responses.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Process message submission (handles both voice transcript and manual text input)
  const submitMessage = async (text: string) => {
    if (!text.trim()) return;

    // User message
    const userMsg: Message = { sender: 'user', text, timestamp: Date.now() };
    setTranscript(prev => [...prev, userMsg]);
    playTick();
    setIsLoading(true);

    // Check for distress or explicit human request first
    if (checkHandoffRequest(text)) {
      await handleHandoff(userMsg);
      return;
    }

    try {
      // Map history for Gemini API
      const historyContext = transcript.map(t => ({
        role: t.sender === 'bot' ? 'model' as const : 'user' as const,
        parts: t.text
      }));

      // Call API
      const response = await fetch('/app/api/voice', { // wait, in nextjs the path matches the route, which is /api/voice
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyContext,
          currentState,
          structuredState
        })
      });

      // Handle direct app route (in some setups it is /api/voice)
      let resolvedResponse = response;
      if (response.status === 404) {
        resolvedResponse = await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: historyContext,
            currentState,
            structuredState
          })
        });
      }

      if (!resolvedResponse.ok) {
        throw new Error(`API error: ${resolvedResponse.statusText}`);
      }

      const data = await resolvedResponse.json();
      const { reply, newState: nextState, stateUpdate } = data;

      // Check loop stuck counter
      if (nextState === currentState && currentState !== ConversationState.START && currentState !== ConversationState.FINISH && currentState !== ConversationState.COMPLETED) {
        stuckCountRef.current += 1;
      } else {
        stuckCountRef.current = 0;
      }

      if (stuckCountRef.current >= 2) {
        await handleHandoff(userMsg);
        return;
      }

      // Update state and log transcript
      setCurrentState(nextState);
      
      const newStructured = {
        ...structuredState,
        ...stateUpdate,
        leadCaptured: {
          ...structuredState.leadCaptured,
          ...(stateUpdate.leadCaptured || {})
        }
      };
      setStructuredState(newStructured);

      const botMsg: Message = { sender: 'bot', text: reply, timestamp: Date.now() };
      setTranscript(prev => [...prev, botMsg]);
      setIsLoading(false);
      playPop();

      // Trigger text to speech
      speakText(reply);

      // Save to Firestore on finish/completed state
      if (nextState === ConversationState.COMPLETED || nextState === ConversationState.FINISH) {
        playSuccess();
        const user = authActions.getCurrentUser();
        if (user) {
          await saveConversationSession({
            userId: user.uid,
            userEmail: user.email || 'guest@skillpivot.ai',
            structuredState: newStructured,
            transcript: [...transcript, userMsg, botMsg]
          });
        }
      }

    } catch (e: any) {
      console.error("Failed to process conversation turn:", e);
      setIsLoading(false);
      setErrorMsg("Failed to communicate with AI agent. Retrying offline...");

      // Offline Fallback local engine (copied from runMockProcessor in lib/gemini)
      // Call mock processor directly in client for seamless operation
      const { runMockProcessor } = require('../lib/gemini');
      const fallbackResult = runMockProcessor(text, currentState, structuredState);
      
      const { reply, newState: nextState, stateUpdate } = fallbackResult;

      // Check loop stuck counter
      if (nextState === currentState && currentState !== ConversationState.START && currentState !== ConversationState.FINISH && currentState !== ConversationState.COMPLETED) {
        stuckCountRef.current += 1;
      } else {
        stuckCountRef.current = 0;
      }

      if (stuckCountRef.current >= 2) {
        await handleHandoff(userMsg);
        return;
      }

      setCurrentState(nextState);
      const newStructured = {
        ...structuredState,
        ...stateUpdate,
        leadCaptured: {
          ...structuredState.leadCaptured,
          ...(stateUpdate.leadCaptured || {})
        }
      };
      setStructuredState(newStructured);

      const botMsg: Message = { sender: 'bot', text: reply, timestamp: Date.now() };
      setTranscript(prev => [...prev, botMsg]);
      speakText(reply);

      if (nextState === ConversationState.COMPLETED || nextState === ConversationState.FINISH) {
        playSuccess();
        const user = authActions.getCurrentUser();
        if (user) {
          saveConversationSession({
            userId: user.uid,
            userEmail: user.email || 'guest@skillpivot.ai',
            structuredState: newStructured,
            transcript: [...transcript, userMsg, botMsg]
          }).catch(console.error);
        }
      }
    }
  };

  const resetAgent = (persona?: 'Student' | 'College' | 'Professional') => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }

    setTranscript([]);
    setComplianceAudit(null);
    setErrorMsg(null);
    setIsListening(false);
    setIsSpeaking(false);
    setIsLoading(false);

    let greeting = "Hi, I am SkillPivot AI. This session may be recorded. Are you exploring technology skills as a student, representing a college, or as a working professional?";
    let startState = ConversationState.START;
    const defaultState = createDefaultState();

    if (persona) {
      defaultState.userType = persona;
      if (persona === 'Student') {
        startState = ConversationState.STUDENT_YEAR;
        greeting = "Hi! I see you are looking to build hands-on skills as a student. Which year of study are you in currently?";
      } else if (persona === 'College') {
        startState = ConversationState.COLLEGE_COUNT;
        greeting = "Hi! Let's explore remote hardware labs for your institution. Around how many students are enrolled in your department?";
      } else if (persona === 'Professional') {
        startState = ConversationState.PROFESSIONAL_ROLE;
        greeting = "Hi! Let's explore upskilling opportunities to grow your career. What is your current job role or technical background?";
      }
    }

    setCurrentState(startState);
    setStructuredState(defaultState);
    setTranscript([{ sender: 'bot', text: greeting, timestamp: Date.now() }]);
    speakText(greeting);
  };

  // Launch initial greeting on active startup
  const startAgent = async (persona?: 'Student' | 'College' | 'Professional') => {
    setErrorMsg(null);
    // Request microphone permission on initial user gesture to prevent browser auto-block
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err: any) {
        console.warn("Initial microphone permission check failed:", err);
        setErrorMsg("Microphone access is blocked. Please allow microphone access in your browser settings to use voice features.");
      }
    }
    resetAgent(persona);
  };

  return {
    currentState,
    structuredState,
    transcript,
    isListening,
    isSpeaking,
    isLoading,
    audioEnabled,
    speechEnabled,
    complianceAudit,
    errorMsg,
    setAudioEnabled,
    setSpeechEnabled,
    startListening,
    stopListening,
    submitMessage,
    resetAgent,
    startAgent,
    setStructuredState,
    setCurrentState,
    setTranscript
  };
}
