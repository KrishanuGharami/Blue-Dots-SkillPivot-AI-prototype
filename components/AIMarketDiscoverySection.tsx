'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  RefreshCw, 
  Sparkles, 
  Building, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  Database,
  Flame,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  Globe
} from 'lucide-react';
import IndiaMapSvg from './IndiaMapSvg';

// City definitions matching coordinates
interface City {
  id: string;
  name: string;
  state: string;
  x: number;
  y: number;
  primaryPersona: 'Student' | 'College' | 'Professional';
  interest: 'AI' | 'Robotics' | 'Cybersecurity' | 'IoT' | 'Cloud' | 'DSA' | 'Web Development';
  confidence: number;
}

const CITIES: City[] = [
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', x: 320, y: 400, primaryPersona: 'Student', interest: 'Robotics', confidence: 96 },
  { id: 'bhilai', name: 'Bhilai', state: 'Chhattisgarh', x: 305, y: 405, primaryPersona: 'Student', interest: 'IoT', confidence: 88 },
  { id: 'bilaspur', name: 'Bilaspur', state: 'Chhattisgarh', x: 325, y: 375, primaryPersona: 'College', interest: 'AI', confidence: 92 },
  { id: 'durg', name: 'Durg', state: 'Chhattisgarh', x: 300, y: 410, primaryPersona: 'College', interest: 'Robotics', confidence: 91 },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', x: 260, y: 415, primaryPersona: 'Professional', interest: 'Web Development', confidence: 93 },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', x: 180, y: 370, primaryPersona: 'Professional', interest: 'AI', confidence: 94 },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', x: 210, y: 355, primaryPersona: 'College', interest: 'IoT', confidence: 90 },
  { id: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', x: 265, y: 350, primaryPersona: 'Student', interest: 'IoT', confidence: 89 },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', x: 370, y: 315, primaryPersona: 'Student', interest: 'AI', confidence: 95 },
  { id: 'patna', name: 'Patna', state: 'Bihar', x: 375, y: 250, primaryPersona: 'College', interest: 'AI', confidence: 97 },
  { id: 'prayagraj', name: 'Prayagraj', state: 'Uttar Pradesh', x: 310, y: 245, primaryPersona: 'Professional', interest: 'DSA', confidence: 91 },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', x: 275, y: 225, primaryPersona: 'College', interest: 'Robotics', confidence: 95 },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', x: 285, y: 215, primaryPersona: 'Student', interest: 'Web Development', confidence: 96 },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', x: 325, y: 245, primaryPersona: 'College', interest: 'IoT', confidence: 93 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', x: 170, y: 245, primaryPersona: 'Professional', interest: 'Cloud', confidence: 94 },
  { id: 'kota', name: 'Kota', state: 'Rajasthan', x: 180, y: 285, primaryPersona: 'Student', interest: 'DSA', confidence: 96 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', x: 390, y: 430, primaryPersona: 'College', interest: 'Robotics', confidence: 97 },
  { id: 'rourkela', name: 'Rourkela', state: 'Odisha', x: 355, y: 360, primaryPersona: 'Professional', interest: 'Cybersecurity', confidence: 92 },
  { id: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', x: 350, y: 495, primaryPersona: 'Student', interest: 'IoT', confidence: 95 },
  { id: 'mysuru', name: 'Mysuru', state: 'Karnataka', x: 170, y: 610, primaryPersona: 'Professional', interest: 'Cloud', confidence: 94 },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', x: 180, y: 640, primaryPersona: 'College', interest: 'IoT', confidence: 96 },
  { id: 'surat', name: 'Surat', state: 'Gujarat', x: 100, y: 395, primaryPersona: 'Student', interest: 'Web Development', confidence: 90 },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', x: 105, y: 370, primaryPersona: 'College', interest: 'AI', confidence: 93 },
  { id: 'nashik', name: 'Nashik', state: 'Maharashtra', x: 120, y: 440, primaryPersona: 'Professional', interest: 'Web Development', confidence: 92 },
  { id: 'aurangabad', name: 'Aurangabad', state: 'Maharashtra', x: 155, y: 450, primaryPersona: 'Student', interest: 'DSA', confidence: 89 },
  { id: 'mangalore', name: 'Mangalore', state: 'Karnataka', x: 145, y: 585, primaryPersona: 'Professional', interest: 'Cybersecurity', confidence: 94 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', x: 500, y: 255, primaryPersona: 'Student', interest: 'AI', confidence: 95 },
  { id: 'siliguri', name: 'Siliguri', state: 'West Bengal', x: 435, y: 240, primaryPersona: 'Student', interest: 'Web Development', confidence: 91 },
  { id: 'gwalior', name: 'Gwalior', state: 'Madhya Pradesh', x: 215, y: 275, primaryPersona: 'Student', interest: 'AI', confidence: 92 },
  { id: 'gaya', name: 'Gaya', state: 'Bihar', x: 380, y: 265, primaryPersona: 'Student', interest: 'Robotics', confidence: 93 },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', x: 130, y: 290, primaryPersona: 'Student', interest: 'Web Development', confidence: 90 },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', x: 110, y: 260, primaryPersona: 'Professional', interest: 'IoT', confidence: 91 },
  { id: 'jamshedpur', name: 'Jamshedpur', state: 'Jharkhand', x: 390, y: 330, primaryPersona: 'College', interest: 'IoT', confidence: 94 },
  { id: 'durgapur', name: 'Durgapur', state: 'West Bengal', x: 420, y: 315, primaryPersona: 'College', interest: 'Cloud', confidence: 90 },
  { id: 'cuttack', name: 'Cuttack', state: 'Odisha', x: 390, y: 415, primaryPersona: 'College', interest: 'Web Development', confidence: 91 },
  { id: 'warangal', name: 'Warangal', state: 'Telangana', x: 270, y: 475, primaryPersona: 'College', interest: 'Robotics', confidence: 92 },
  { id: 'kozhikode', name: 'Kozhikode', state: 'Kerala', x: 165, y: 625, primaryPersona: 'Professional', interest: 'Cybersecurity', confidence: 93 },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', x: 200, y: 670, primaryPersona: 'Student', interest: 'Cloud', confidence: 94 },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', x: 155, y: 135, primaryPersona: 'Student', interest: 'DSA', confidence: 91 },
  { id: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', x: 210, y: 160, primaryPersona: 'Professional', interest: 'Cloud', confidence: 95 }
];

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

interface BlueDotSignal {
  city: string;
  state: string;
  persona: string;
  interest: string;
  intent: string;
  signal: string;
  confidence: number;
  status: string;
  timestamp: string;
}

export default function AIMarketDiscoverySection() {
  // Voice Agent States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [agentState, setAgentState] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'>('IDLE');
  const [currentStep, setCurrentStep] = useState<string>('INIT');
  const [userPersona, setUserPersona] = useState<'Student' | 'College' | 'Professional' | null>(null);
  
  // Language configuration (en = English, hi = Hindi)
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Accumulated data from conversation
  const [profileData, setProfileData] = useState<{
    city?: string;
    interest?: 'AI' | 'Robotics' | 'Cybersecurity' | 'IoT' | 'Cloud' | 'DSA' | 'Web Development';
    intent?: string;
    details?: string;
  }>({});

  // Active Map details
  const [activeCityId, setActiveCityId] = useState<string | null>(null);
  const [activeSignal, setActiveSignal] = useState<BlueDotSignal | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mapRipples, setMapRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  
  // Completed Leads (turns dots RED)
  const [completedCityIds, setCompletedCityIds] = useState<string[]>([]);
  
  // Manual / Visual map filtering tabs
  const [manualFilter, setManualFilter] = useState<'all' | 'Student' | 'College' | 'Professional'>('all');

  // Metrics & Stats
  const [stats, setStats] = useState({
    blueDots: 40,
    students: 18,
    colleges: 10,
    professionals: 12,
    topTech: 'Robotics',
    activeState: 'Maharashtra',
    demandCity: 'Raipur'
  });

  const [skillsMetrics, setSkillsMetrics] = useState({
    AI: 8,
    Robotics: 12,
    Cybersecurity: 5,
    IoT: 7,
    Cloud: 4,
    DSA: 3,
    WebDev: 6
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stuckWordsFilterRef = useRef<string[]>(['guaranteed', '100%', 'best', 'perfect']);

  // STT / TTS Initializers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = language === 'hi' ? 'hi-IN' : 'en-US';

        rec.onstart = () => setAgentState('LISTENING');
        rec.onresult = (e: any) => {
          const text = e.results[0][0].transcript;
          handleUserResponse(text);
        };
        rec.onerror = () => setAgentState('IDLE');
        rec.onend = () => setAgentState('IDLE');
        recognitionRef.current = rec;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Handle Initial Greeting loading
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const greeting = language === 'hi'
        ? "नमस्ते! मैं स्किलपिवट का मार्केट डिस्कवरी एआई हूँ। आज आप कौन हैं? क्या आप एक छात्र (Student), कॉलेज (College), या वर्किंग प्रोफेशनल (Professional) हैं?"
        : "Hello! I am SkillPivot's Market Discovery AI. Who are you today? Are you a Student, College, or Professional?";
      
      setMessages([{ sender: 'bot', text: greeting }]);
      speakText(greeting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentState]);

  // Audio synthezier tick sound effect
  const playBeep = (freq = 600, duration = 0.05) => {
    if (typeof window === 'undefined') return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Speaks output reply
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Choose appropriate voice match (Hindi or English)
    const voiceLoc = language === 'hi' ? 'hi-IN' : 'en-US';
    const friendlyVoice = voices.find(v => v.lang.startsWith(voiceLoc)) || voices.find(v => v.lang.startsWith('en-US'));
    if (friendlyVoice) utterance.voice = friendlyVoice;
    utterance.rate = 1.05;
    
    utterance.onstart = () => setAgentState('SPEAKING');
    utterance.onend = () => setAgentState('IDLE');
    utterance.onerror = () => setAgentState('IDLE');
    window.speechSynthesis.speak(utterance);
  };

  const triggerBotReply = (text: string) => {
    setAgentState('THINKING');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text }]);
      speakText(text);
    }, 600);
  };

  // Primary dialogue progression controller
  const handleUserResponse = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    playBeep(400, 0.08);

    const lower = text.toLowerCase();
    
    // Check compliance rules
    let cleanText = text;
    stuckWordsFilterRef.current.forEach(word => {
      if (lower.includes(word)) {
        cleanText = cleanText.replace(new RegExp(word, 'gi'), '***');
      }
    });

    const isHi = language === 'hi';

    // 1. Initial State: Choosing User Persona
    if (currentStep === 'INIT') {
      if (lower.includes('student') || lower.includes('छात्र') || lower.includes('student') || lower.includes('s')) {
        setUserPersona('Student');
        setManualFilter('Student');
        setCurrentStep('STUDENT_YEAR');
        triggerBotReply(isHi 
          ? "बहुत बढ़िया, एक छात्र! वर्तमान में आप किस वर्ष में अध्ययन कर रहे हैं?" 
          : "Awesome, a student building career skills! Which year of study are you in currently?");
      } else if (lower.includes('college') || lower.includes('university') || lower.includes('कॉलेज') || lower.includes('c')) {
        setUserPersona('College');
        setManualFilter('College');
        setCurrentStep('COLLEGE_NAME');
        triggerBotReply(isHi 
          ? "शानदार। आइए आपकी कॉलेज की जानकारी दर्ज करें। आपके कॉलेज या विश्वविद्यालय का नाम क्या है?" 
          : "Excellent. Let's capture your institutional readiness. What is the name of your College or University?");
      } else if (lower.includes('professional') || lower.includes('working') || lower.includes('प्रोफेशनल') || lower.includes('p')) {
        setUserPersona('Professional');
        setManualFilter('Professional');
        setCurrentStep('PROFESSIONAL_ROLE');
        triggerBotReply(isHi 
          ? "आपसे मिलकर खुशी हुई। करियर ग्रोथ के लिए रीस्किलिंग जरूरी है। आपका वर्तमान रोल या बैकग्राउंड क्या है?" 
          : "Glad to meet you. Reskilling opens new career paths. What is your current technical job role or background?");
      } else {
        triggerBotReply(isHi
          ? "मैं समझ नहीं पाया। क्या आप एक छात्र (Student), कॉलेज (College), या प्रोफेशनल (Professional) हैं?"
          : "I didn't quite catch that. Are you a Student, College, or Professional?");
      }
      return;
    }

    // 2. STUDENT CONVERSATION FLOW
    if (userPersona === 'Student') {
      switch (currentStep) {
        case 'STUDENT_YEAR':
          setProfileData(prev => ({ ...prev, details: text }));
          setCurrentStep('STUDENT_CITY');
          triggerBotReply(isHi 
            ? "ठीक है। वर्तमान में आप भारत के किस शहर में स्थित हैं?" 
            : "Got it. Which city in India are you located in currently?");
          break;
          
        case 'STUDENT_CITY':
          const matchedCity = detectCity(text);
          setProfileData(prev => ({ ...prev, city: matchedCity.name }));
          setCurrentStep('STUDENT_INTEREST');
          triggerBotReply(isHi
            ? `${matchedCity.name} के छात्र! आपकी रुचि किस तकनीकी क्षेत्र में सबसे अधिक है? (जैसे AI, Robotics, IoT, Web Dev)`
            : `Excellent, a learner in ${matchedCity.name}! What technical field interests you most? (e.g. AI, Robotics, Cybersecurity, IoT, Cloud, DSA, Web Dev)`);
          triggerMapRipple(matchedCity);
          break;

        case 'STUDENT_INTEREST':
          const detectedSkill = detectSkill(text);
          setProfileData(prev => ({ ...prev, interest: detectedSkill }));
          setCurrentStep('STUDENT_GOAL');
          triggerBotReply(isHi
            ? `${detectedSkill} में एआई-संचालित सिस्टम की भारी मांग है। आपका प्राथमिक लक्ष्य क्या है?`
            : `AI-powered systems in ${detectedSkill} are high in demand. What is your primary learning goal? (e.g., job preparation, building projects)`);
          break;

        case 'STUDENT_GOAL':
          setProfileData(prev => ({ ...prev, intent: 'Access Labs' }));
          setCurrentStep('COMPLETED');
          
          // Complete and publish signal
          const finalCity = profileData.city || 'Raipur';
          const finalSkill = profileData.interest || 'AI';
          
          publishMarketSignal(finalCity, 'Student', finalSkill, 'Access Labs', 'Needs Remote Hands-on Lab Sandbox');
          triggerBotReply(isHi
            ? `आपके लक्ष्यों के अनुसार, हम रिमोट हार्डवेयर और आईओटी लैब की सिफारिश करते हैं। क्या आप डेमो सेशन बुक करना चाहेंगे?`
            : `Based on your goals in ${finalSkill}, we recommend our personalized path with remote IoT and hardware labs. Would you like to schedule a trial sandbox session?`);
          
          // Add to completed list (turn dot RED)
          const matchedCityObj = CITIES.find(c => c.name === finalCity);
          if (matchedCityObj) {
            setCompletedCityIds(prev => [...prev, matchedCityObj.id]);
          }

          // Update analytics metrics
          setStats(prev => ({ 
            ...prev, 
            blueDots: prev.blueDots + 1, 
            students: prev.students + 1,
            demandCity: finalCity 
          }));
          incrementSkillMetric(finalSkill);
          break;
          
        case 'COMPLETED':
          triggerBotReply(isHi
            ? "धन्यवाद! आपका सत्यापित मार्केट डिस्कवरी सिग्नल मैप पर एक लाल बिंदु के रूप में दर्ज हो गया है।"
            : "Thank you! Your verified market discovery signal has been added as a glowing Red Dot on the Indian map.");
          break;
      }
      return;
    }

    // 3. COLLEGE / UNIVERSITY CONVERSATION FLOW
    if (userPersona === 'College') {
      switch (currentStep) {
        case 'COLLEGE_NAME':
          setProfileData(prev => ({ ...prev, details: text }));
          setCurrentStep('COLLEGE_CITY');
          triggerBotReply(isHi
            ? "धन्यवाद। आपका कॉलेज किस शहर में स्थित है?"
            : "Thank you. Which city is your institution located in?");
          break;

        case 'COLLEGE_CITY':
          const matchedCity = detectCity(text);
          setProfileData(prev => ({ ...prev, city: matchedCity.name }));
          setCurrentStep('COLLEGE_INTEREST');
          triggerBotReply(isHi
            ? `बहुत बढ़िया। आपका विभाग किस टेक्नोलॉजी लैब को स्थापित करना चाहता है? (जैसे Robotics Lab, AI Lab)`
            : `Perfect. Which technology lab is your department looking to establish? (e.g., Robotics Lab, AI Lab, IoT Sandbox)`);
          triggerMapRipple(matchedCity);
          break;

        case 'COLLEGE_INTEREST':
          const detectedSkill = detectSkill(text);
          setProfileData(prev => ({ ...prev, interest: detectedSkill }));
          setCurrentStep('COLLEGE_PILOT');
          triggerBotReply(isHi
            ? "समझ गया। स्किलपिवट लैब सेटअप में मदद करता है। क्या आप छात्रों के लिए ट्रायल लैब पायलट सेटअप करना चाहेंगे?"
            : "Understood. SkillPivot helps set up remote hardware labs. Are you interested in setting up a pilot lab trial for your students?");
          break;

        case 'COLLEGE_PILOT':
          setProfileData(prev => ({ ...prev, intent: 'Book Institution Pilot' }));
          setCurrentStep('COMPLETED');
          
          const finalCity = profileData.city || 'Patna';
          const finalSkill = profileData.interest || 'Robotics';
          
          publishMarketSignal(finalCity, 'College', finalSkill, 'Book Pilot', 'Seeking AI-powered Remote Hardware Labs');
          triggerBotReply(isHi
            ? `शानदार। हमने आपका अनुरोध दर्ज कर लिया है। एक समन्वयक जल्द ही पायलट शेड्यूलिंग के लिए आपसे संपर्क करेगा।`
            : `Perfect. We will register this verified institutional signal. A coordinator will contact your department to schedule the remote hardware pilot session.`);
          
          // Add to completed list (turn dot RED)
          const matchedCityObj = CITIES.find(c => c.name === finalCity);
          if (matchedCityObj) {
            setCompletedCityIds(prev => [...prev, matchedCityObj.id]);
          }

          setStats(prev => ({ 
            ...prev, 
            blueDots: prev.blueDots + 1, 
            colleges: prev.colleges + 1,
            demandCity: finalCity 
          }));
          incrementSkillMetric(finalSkill);
          break;

        case 'COMPLETED':
          triggerBotReply(isHi
            ? "स्किलपिवट एआई चुनने के लिए धन्यवाद। आपकी कॉलेज की जानकारी दर्ज कर दी गई है।"
            : "Thank you for choosing SkillPivot AI. Your institution's signal has been mapped to our database.");
          break;
      }
      return;
    }

    // 4. WORKING PROFESSIONAL FLOW
    if (userPersona === 'Professional') {
      switch (currentStep) {
        case 'PROFESSIONAL_ROLE':
          setProfileData(prev => ({ ...prev, details: text }));
          setCurrentStep('PROFESSIONAL_CITY');
          triggerBotReply(isHi
            ? "ठीक है। वर्तमान में आप किस शहर में स्थित हैं?"
            : "Excellent. Which city are you located in currently?");
          break;

        case 'PROFESSIONAL_CITY':
          const matchedCity = detectCity(text);
          setProfileData(prev => ({ ...prev, city: matchedCity.name }));
          setCurrentStep('PROFESSIONAL_INTEREST');
          triggerBotReply(isHi
            ? "गॉट इट। करियर ट्रांजिशन के लिए आप कौन सी टेक सीखना चाहते हैं?"
            : "Got it. Which tech stack are you looking to master for your career transition?");
          triggerMapRipple(matchedCity);
          break;

        case 'PROFESSIONAL_INTEREST':
          const detectedSkill = detectSkill(text);
          setProfileData(prev => ({ ...prev, interest: detectedSkill }));
          setCurrentStep('PROFESSIONAL_GOAL');
          triggerBotReply(isHi
            ? `${detectedSkill} सीखना बहुत फायदेमंद है। आप प्रोजेक्ट वर्क के लिए प्रति सप्ताह कितने घंटे दे सकते हैं?`
            : `Reskilling in ${detectedSkill} is highly valuable. How many hours a week can you commit to flexible project learning?`);
          break;

        case 'PROFESSIONAL_GOAL':
          setProfileData(prev => ({ ...prev, intent: 'Upskill Program' }));
          setCurrentStep('COMPLETED');
          
          const finalCity = profileData.city || 'Indore';
          const finalSkill = profileData.interest || 'Cloud';
          
          publishMarketSignal(finalCity, 'Professional', finalSkill, 'Upskill Program', 'Needs Weekend Flexible Project Labs');
          triggerBotReply(isHi
            ? `समझ गया। हम वीकेंड लाइव प्रोजेक्ट्स और रिमोट हार्डवेयर लैब की सिफारिश करते हैं। आइए एक परामर्श शेड्यूलर सेशन की व्यवस्था करें!`
            : `Understood. We recommend our flexible professional path featuring weekend live project coaching and remote hardware sandboxes. Let's arrange a consultation!`);
          
          // Add to completed list (turn dot RED)
          const matchedCityObj = CITIES.find(c => c.name === finalCity);
          if (matchedCityObj) {
            setCompletedCityIds(prev => [...prev, matchedCityObj.id]);
          }

          setStats(prev => ({ 
            ...prev, 
            blueDots: prev.blueDots + 1, 
            professionals: prev.professionals + 1,
            demandCity: finalCity 
          }));
          incrementSkillMetric(finalSkill);
          break;

        case 'COMPLETED':
          triggerBotReply(isHi
            ? "आपकी रीस्किलिंग जानकारी सत्यापित हो गई है। लाल बिंदु आपके क्षेत्र में एक्टिव मांग को दर्शाता है।"
            : "Your upskilling intent is verified. The red dot represents active learning demand in your location.");
          break;
      }
      return;
    }
  };

  // Helper matching city names in voice transcripts
  const detectCity = (text: string): City => {
    const lower = text.toLowerCase();
    for (const city of CITIES) {
      if (lower.includes(city.name.toLowerCase())) {
        return city;
      }
    }
    // Default fallback city if not found in dictionary
    return CITIES[Math.floor(Math.random() * CITIES.length)];
  };

  // Helper matching tech interests
  const detectSkill = (text: string): 'AI' | 'Robotics' | 'Cybersecurity' | 'IoT' | 'Cloud' | 'DSA' | 'Web Development' => {
    const lower = text.toLowerCase();
    if (lower.includes('robot')) return 'Robotics';
    if (lower.includes('ai') || lower.includes('intelligence') || lower.includes('machine')) return 'AI';
    if (lower.includes('cyber') || lower.includes('security')) return 'Cybersecurity';
    if (lower.includes('iot') || lower.includes('internet')) return 'IoT';
    if (lower.includes('cloud') || lower.includes('devops')) return 'Cloud';
    if (lower.includes('dsa') || lower.includes('data structure')) return 'DSA';
    return 'Web Development';
  };

  const incrementSkillMetric = (skill: string) => {
    setSkillsMetrics(prev => {
      const copy = { ...prev } as any;
      if (skill === 'AI') copy.AI += 1;
      else if (skill === 'Robotics') copy.Robotics += 1;
      else if (skill === 'Cybersecurity') copy.Cybersecurity += 1;
      else if (skill === 'IoT') copy.IoT += 1;
      else if (skill === 'Cloud') copy.Cloud += 1;
      else if (skill === 'DSA') copy.DSA += 1;
      else copy.WebDev += 1;
      return copy;
    });
  };

  // Triggers localized animation ripples on the map
  const triggerMapRipple = (city: City) => {
    setActiveCityId(city.id);
    const newRipple = { x: city.x, y: city.y, id: Date.now() };
    setMapRipples(prev => [...prev, newRipple]);
    
    // Auto-remove ripple after animations end
    setTimeout(() => {
      setMapRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 3000);
  };

  // Publishes a live structured Blue Dot Signal card
  const publishMarketSignal = (
    cityName: string,
    personaName: string,
    interestName: string,
    intentName: string,
    signalDesc: string
  ) => {
    const matchedCity = CITIES.find(c => c.name === cityName) || CITIES[0];
    setActiveCityId(matchedCity.id);
    
    const newSignal: BlueDotSignal = {
      city: cityName,
      state: matchedCity.state,
      persona: personaName,
      interest: interestName,
      intent: intentName,
      signal: signalDesc,
      confidence: matchedCity.confidence,
      status: completedCityIds.includes(matchedCity.id) 
        ? 'Lead Activated (Red Dot)' 
        : matchedCity.confidence >= 95 
          ? 'Highest Matching Node (Red Dot)' 
          : 'Verified Market Signal',
      timestamp: 'Just Now'
    };
    
    setActiveSignal(newSignal);
    playBeep(880, 0.15); // Success note
  };

  // Triggers microphone capturing
  const startSTT = () => {
    if (recognitionRef.current) {
      window.speechSynthesis.cancel();
      recognitionRef.current.start();
    }
  };

  const stopSTT = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const resetAll = () => {
    setMessages([]);
    setCurrentStep('INIT');
    setUserPersona(null);
    setManualFilter('all');
    setProfileData({});
    setActiveCityId(null);
    setActiveSignal(null);
    
    const greeting = language === 'hi'
      ? "नमस्ते! मैं स्किलपिवट का मार्केट डिस्कवरी एआई हूँ। आज आप कौन हैं? क्या आप एक छात्र (Student), कॉलेज (College), या वर्किंग प्रोफेशनल (Professional) हैं?"
      : "Hello! I am SkillPivot's Market Discovery AI. Who are you today? Are you a Student, College, or Professional?";
    
    setMessages([{ sender: 'bot', text: greeting }]);
    speakText(greeting);
  };

  // Handles double click or click to toggle skill tags manually
  const handleTagClick = (skillName: 'AI' | 'Robotics' | 'Cybersecurity' | 'IoT' | 'Cloud' | 'DSA' | 'Web Development') => {
    setProfileData(prev => {
      const isSelected = prev.interest === skillName;
      return {
        ...prev,
        interest: isSelected ? undefined : skillName
      };
    });
  };

  // Usecase mapping filters: show points relevant only for the customer based on their usecases/interests
  const activeFilter = userPersona || manualFilter;
  const activeInterest = profileData.interest;

  const visibleCities = CITIES.filter(city => {
    // Keep active highlighted city always shown to prevent layout jumps
    if (activeCityId === city.id) return true;
    
    // Filter STRICTLY by Technology Interest if defined
    if (activeInterest) {
      return city.interest === activeInterest;
    }

    // Filter by User Persona (Usecase) if no interest is active yet
    if (activeFilter !== 'all' && city.primaryPersona !== activeFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <section className="w-full bg-[#0b0f19] text-slate-100 py-16 px-4 md:px-12 relative overflow-hidden font-sans">
      
      {/* OS Dashboard Header */}
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles size={12} className="animate-pulse" />
            <span>🔵 AI Market Discovery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
            Every Conversation Creates a Blue Dot.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            SkillPivot AI helps students, colleges, and working professionals discover the right learning journey while simultaneously revealing hidden demand for practical technology education across India.
          </p>
        </div>

        {/* 2-Column Responsive Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT SIDE: AI Voice Agent (45%) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/40 border border-slate-900 rounded-3xl p-6 relative overflow-hidden shadow-2xl backdrop-blur-md min-h-[580px]">
            {/* Glowing top border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            
            {/* Title block */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <div className="space-y-0.5">
                <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  🎙️ SkillPivot AI Assistant
                </h3>
                <span className="text-[11px] text-slate-400 font-normal">Discover your path in under two minutes</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Language Selectors */}
                <div className="flex bg-slate-900/60 p-0.5 rounded-lg border border-slate-800 text-[10px] items-center">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded transition-colors ${language === 'en' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-1 rounded transition-colors ${language === 'hi' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    हिन्दी
                  </button>
                </div>

                <button 
                  onClick={resetAll}
                  className="p-1.5 hover:bg-slate-900 border border-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Restart Session"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* Conversation Log area */}
            <div className="flex-1 my-4 overflow-y-auto space-y-4 max-h-[300px] pr-2 custom-scrollbar">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10 font-medium' 
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-200 rounded-bl-none font-normal'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Thinking Indicator */}
              {agentState === 'THINKING' && (
                <div className="flex justify-start items-center space-x-1.5 p-2 bg-slate-900/40 rounded-xl w-fit border border-slate-900">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Visual Indicators & Inputs Panel */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              
              {/* Dynamic waveform & state label */}
              <div className="flex flex-col items-center justify-center space-y-2 py-3 bg-slate-950/60 border border-slate-900 rounded-2xl relative">
                
                {agentState === 'LISTENING' && (
                  <div className="flex items-end justify-center space-x-1 h-6 select-none animate-fadeIn">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => (
                      <span 
                        key={idx}
                        className="w-1 bg-cyan-400 rounded-full animate-voiceWave" 
                        style={{ 
                          height: '24px',
                          animationDelay: `${idx * 100}ms`,
                          animationDuration: '0.8s'
                        }} 
                      />
                    ))}
                  </div>
                )}

                {agentState === 'SPEAKING' && (
                  <div className="flex items-end justify-center space-x-1 h-6 select-none animate-fadeIn">
                    {[1, 2, 3, 2, 1].map((val, idx) => (
                      <span 
                        key={idx}
                        className="w-1.5 bg-blue-500 rounded-full animate-voiceWaveSlow" 
                        style={{ 
                          height: '16px',
                          animationDelay: `${idx * 200}ms`,
                          animationDuration: '1.4s'
                        }} 
                      />
                    ))}
                  </div>
                )}

                {agentState === 'IDLE' && (
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Agent Idle</span>
                )}

                {agentState === 'LISTENING' && (
                  <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase animate-pulse">Listening... Speak now</span>
                )}

                {agentState === 'SPEAKING' && (
                  <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase animate-pulse">Speaking Response</span>
                )}
              </div>

              {/* Inputs Panel (Voice and Text combined) */}
              <div className="flex items-center space-x-3">
                {/* Large glowing microphone button */}
                <button
                  onClick={agentState === 'LISTENING' ? stopSTT : startSTT}
                  className={`p-4 rounded-full flex items-center justify-center transition-all duration-300 relative cursor-pointer border ${
                    agentState === 'LISTENING'
                      ? 'bg-red-500/20 border-red-500 text-red-500 shadow-lg shadow-red-500/20 scale-105'
                      : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white hover:scale-105 shadow-lg shadow-blue-500/10'
                  }`}
                  title={agentState === 'LISTENING' ? "Stop recording" : "Speak response"}
                >
                  {agentState === 'LISTENING' ? <MicOff size={22} className="animate-pulse" /> : <Mic size={22} />}
                </button>

                {/* Keyboard text input field */}
                <div className="flex-1 flex items-center bg-slate-950/60 border border-slate-900 rounded-full px-4 py-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (handleUserResponse(inputText), setInputText(''))}
                    placeholder={language === 'hi' ? "उत्तर लिखें या बात करने के लिए माइक दबाएं..." : "Type reply or click mic to talk..."}
                    className="w-full bg-transparent border-none text-slate-200 text-xs focus:outline-none placeholder-slate-600 py-2.5"
                  />
                  <button 
                    onClick={() => {
                      handleUserResponse(inputText);
                      setInputText('');
                    }}
                    className="p-1.5 hover:bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Preset Helpers */}
              {currentStep === 'INIT' && (
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={() => handleUserResponse("Student")} className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl text-xs font-semibold tracking-tight transition-all duration-300 cursor-pointer flex items-center gap-1">
                    <GraduationCap size={13} />
                    <span>{language === 'hi' ? 'छात्र (Student)' : 'Student'}</span>
                  </button>
                  <button onClick={() => handleUserResponse("College")} className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl text-xs font-semibold tracking-tight transition-all duration-300 cursor-pointer flex items-center gap-1">
                    <Building size={13} />
                    <span>{language === 'hi' ? 'कॉलेज (College)' : 'College'}</span>
                  </button>
                  <button onClick={() => handleUserResponse("Professional")} className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl text-xs font-semibold tracking-tight transition-all duration-300 cursor-pointer flex items-center gap-1">
                    <Briefcase size={13} />
                    <span>{language === 'hi' ? 'पेशेवर (Professional)' : 'Professional'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Interactive India Blue Dots Map (55%) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/40 border border-slate-900 rounded-3xl p-6 relative overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* Dynamic Usecase Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-4 mb-4 border-b border-slate-900 gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Filter size={13} className="text-cyan-400" />
                Active Usecase Filters
              </span>
              <div className="flex items-center gap-2">
                {activeInterest && (
                  <span 
                    onClick={() => setProfileData(prev => ({ ...prev, interest: undefined }))}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-tight animate-pulse select-none cursor-pointer hover:bg-cyan-900/80 transition-colors"
                    title="Click to clear interest filter"
                  >
                    🎯 Focus: {activeInterest} ×
                  </span>
                )}
                <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-855 text-[11px]">
                  {(['all', 'Student', 'College', 'Professional'] as const).map((mode) => {
                    const isActive = activeFilter === mode;
                    const labelMap = {
                      all: 'All',
                      Student: 'Students',
                      College: 'Colleges',
                      Professional: 'Professionals'
                    };
                    return (
                      <button
                        key={mode}
                        onClick={() => !userPersona && setManualFilter(mode)}
                        disabled={!!userPersona}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-all duration-300 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                        }`}
                      >
                        {labelMap[mode]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Split layout inside map panel (map left, info card right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
              
              {/* India map SVG */}
              <div className="md:col-span-7 flex justify-center items-center relative select-none min-h-[380px]">
                <IndiaMapSvg 
                  hoveredState={hoveredState} 
                  setHoveredState={setHoveredState} 
                  className="w-full max-w-[340px] h-auto drop-shadow-[0_8px_32px_rgba(0,100,255,0.02)] transition-opacity duration-500"
                />

                {/* Glowing filtered dots & custom ripples */}
                <div className="absolute inset-0 pointer-events-none">
                  {visibleCities.map((city) => {
                    const isCompleted = completedCityIds.includes(city.id);
                    // Glowing RED if user has completed dialogue OR if the city is a highest match (confidence >= 95) with an active interest filter
                    const isHighestMatch = city.confidence >= 95 && !!activeInterest;
                    const isRed = isCompleted || isHighestMatch;
                    
                    const isCurrent = activeCityId === city.id;
                    return (
                      <div
                        key={city.id}
                        className="absolute group pointer-events-auto"
                        style={{ 
                          left: `${(city.x / 612) * 100}%`, 
                          top: `${(city.y / 696) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: isCurrent ? 50 : 20
                        }}
                        onMouseEnter={() => {
                          setActiveCityId(city.id);
                          publishMarketSignal(city.name, userPersona || city.primaryPersona, city.interest, 'Access Labs', 'Needs Remote Hands-on Lab Sandbox');
                        }}
                      >
                        {/* Static / Glowing / Red core dot */}
                        <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md cursor-pointer transition-all duration-300 ${
                          isRed
                            ? 'bg-red-500 shadow-[0_0_14px_#ef4444] scale-110 animate-pulse'
                            : isCurrent 
                              ? 'bg-cyan-400 scale-125 shadow-cyan-400/50 shadow-lg' 
                              : 'bg-blue-600 hover:bg-cyan-400 hover:scale-115'
                        }`} />

                        {/* Constant subtle pulsing animation */}
                        <span className={`absolute inset-0 rounded-full animate-ping pointer-events-none ${
                          isRed ? 'bg-red-500/20' : 'bg-blue-500/20'
                        }`} style={{ animationDuration: '3s' }} />
                      </div>
                    );
                  })}

                  {/* Real-time Event Ripples */}
                  {mapRipples.map((ripple) => (
                    <div
                      key={ripple.id}
                      className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/50 bg-cyan-400/10 pointer-events-none animate-ping"
                      style={{ 
                        left: `${(ripple.x / 612) * 100}%`, 
                        top: `${(ripple.y / 696) * 100}%`,
                        animationDuration: '1.2s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar Active Signal Card (md:col-span-5) */}
              <div className="md:col-span-5 flex flex-col justify-center h-full">
                {activeSignal ? (
                  <div className="p-4 bg-slate-900/60 border border-cyan-500/20 rounded-2xl space-y-4 shadow-xl shadow-cyan-950/10 relative animate-fadeInUp">
                    {/* Glimmer glow effect */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-cyan-500/10 rounded-full filter blur-md" />
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-cyan-400 tracking-wider">Live Signal</span>
                        <h4 className="text-sm font-extrabold text-white mt-0.5 flex items-center gap-1">
                          <MapPin size={12} className="text-cyan-400" />
                          {activeSignal.city}
                        </h4>
                        <span className="text-[10px] text-slate-400">{activeSignal.state}</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 animate-pulse">
                        {activeSignal.confidence}% Match
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-900">
                      <div>
                        <span className="text-slate-500 block font-normal text-[10px]">Persona</span>
                        <span className="text-slate-200 font-semibold">{activeSignal.persona}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-normal text-[10px]">Interests</span>
                        <span className="text-slate-200 font-semibold">{activeSignal.interest}</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-900">
                      <span className="text-slate-500 block font-normal text-[10px]">Intent Signal</span>
                      <p className="text-slate-300 font-medium text-[11px] leading-snug">{activeSignal.signal}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-cyan-400" />
                        {activeSignal.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {activeSignal.timestamp}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl border-dashed text-center flex flex-col items-center justify-center space-y-3 h-48">
                    <Database size={24} className="text-slate-700 animate-pulse" />
                    <span className="text-xs text-slate-500 font-normal">Waiting for active conversation signal or hover map dot...</span>
                  </div>
                )}
              </div>

            </div>

            {/* Heatmap/Top Requested Skills tag section */}
            <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-400 tracking-tight flex items-center gap-1.5 shrink-0 select-none">
                <TrendingUp size={14} className="text-cyan-400" />
                Top Skills Requested:
              </span>
              <div className="flex flex-wrap gap-1.5 overflow-hidden">
                <button 
                  onClick={() => handleTagClick('AI')}
                  className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    activeInterest === 'AI' ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 scale-[1.03]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  AI ({skillsMetrics.AI})
                </button>
                <button 
                  onClick={() => handleTagClick('Robotics')}
                  className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    activeInterest === 'Robotics' ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 scale-[1.03]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  Robotics ({skillsMetrics.Robotics})
                </button>
                <button 
                  onClick={() => handleTagClick('Cybersecurity')}
                  className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    activeInterest === 'Cybersecurity' ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 scale-[1.03]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  Cybersecurity ({skillsMetrics.Cybersecurity})
                </button>
                <button 
                  onClick={() => handleTagClick('IoT')}
                  className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    activeInterest === 'IoT' ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 scale-[1.03]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  IoT ({skillsMetrics.IoT})
                </button>
                <button 
                  onClick={() => handleTagClick('Cloud')}
                  className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    activeInterest === 'Cloud' ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 scale-[1.03]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  Cloud ({skillsMetrics.Cloud})
                </button>
                <button 
                  onClick={() => handleTagClick('DSA')}
                  className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    activeInterest === 'DSA' ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 scale-[1.03]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  DSA ({skillsMetrics.DSA})
                </button>
                <button 
                  onClick={() => handleTagClick('Web Development')}
                  className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    activeInterest === 'Web Development' ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 scale-[1.03]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  Web Dev ({skillsMetrics.WebDev})
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM METRICS: Market Analytics Dashboard */}
        <div className="pt-6 border-t border-slate-900">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block select-none">Blue Dots Created</span>
              <span className="text-xl font-extrabold text-cyan-400 mt-2">{stats.blueDots}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block select-none">Students Profiled</span>
              <span className="text-xl font-extrabold text-white mt-2">{stats.students}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block select-none">College Pilots</span>
              <span className="text-xl font-extrabold text-white mt-2">{stats.colleges}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block select-none">Professionals</span>
              <span className="text-xl font-extrabold text-white mt-2">{stats.professionals}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block select-none">Top Request</span>
              <span className="text-sm font-extrabold text-slate-300 mt-2 truncate">{stats.topTech}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block select-none">Active State</span>
              <span className="text-sm font-extrabold text-slate-300 mt-2 truncate">{stats.activeState}</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block select-none">Highest Demand</span>
              <span className="text-sm font-extrabold text-cyan-400 mt-2 truncate">{stats.demandCity}</span>
            </div>

          </div>
        </div>

        {/* BOTTOM TIMELINE: Discovery Pipeline */}
        <div className="pt-6 border-t border-slate-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-3.5 px-6 bg-slate-950/60 border border-slate-900 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 tracking-tight shrink-0 flex items-center gap-1.5 select-none">
              <Flame size={14} className="text-amber-500 animate-pulse" />
              Discovery Pipeline:
            </span>
            
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-between w-full text-[10px] font-mono text-slate-500 max-w-4xl">
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-4 h-4 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</span>
                <span>Conversation</span>
              </div>
              <span className="hidden sm:inline text-slate-800">→</span>
              
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-4 h-4 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">2</span>
                <span>Intent Detection</span>
              </div>
              <span className="hidden sm:inline text-slate-800">→</span>
              
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-4 h-4 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">3</span>
                <span>AI Analysis</span>
              </div>
              <span className="hidden sm:inline text-slate-800">→</span>
              
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-4 h-4 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold">4</span>
                <span>Market Signal</span>
              </div>
              <span className="hidden sm:inline text-slate-800">→</span>
              
              <div className="flex items-center gap-1.5 py-1 animate-pulse">
                <span className="w-4 h-4 rounded-full bg-cyan-400 border border-cyan-400 flex items-center justify-center text-slate-950 font-bold">5</span>
                <span className="text-cyan-400 font-semibold">Blue Dot Created</span>
              </div>
              <span className="hidden sm:inline text-slate-800">→</span>
              
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-bold">6</span>
                <span>Institution Match</span>
              </div>
              <span className="hidden sm:inline text-slate-800">→</span>
              
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-bold">7</span>
                <span>Demo Scheduled</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
