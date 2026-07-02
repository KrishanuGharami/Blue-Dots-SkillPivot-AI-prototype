'use client';

import React from 'react';
import { UserCheck, Sparkles, GraduationCap, School, Briefcase } from 'lucide-react';
import { ConversationState, StructuredState } from '../lib/stateMachine';

interface ProfileSelectorProps {
  submitMessage: (text: string) => void;
  resetAgent: () => void;
  setStructuredState: React.Dispatch<React.SetStateAction<StructuredState>>;
  setCurrentState: React.Dispatch<React.SetStateAction<ConversationState>>;
  setTranscript: React.Dispatch<React.SetStateAction<any[]>>;
  speakText: (text: string) => void;
}

export default function ProfileSelector({
  submitMessage,
  resetAgent,
  setStructuredState,
  setCurrentState,
  setTranscript,
  speakText,
}: ProfileSelectorProps) {
  
  const loadPresetProfile = (type: 'student' | 'college' | 'professional') => {
    resetAgent();

    if (type === 'student') {
      const studentState: StructuredState = {
        userType: 'Student',
        goal: 'Year: 3rd Year | Target: Core Technical Job',
        painPoint: 'No access to practical labs',
        interest: 'Robotics & Automation',
        intent: 'Recommended: Remote Robotics Lab',
        leadCaptured: {
          name: 'Jane Doe',
          phone: '+91 98765 43210',
          email: 'jane.doe@univ.edu',
          college: 'Global Engineering Institute'
        }
      };

      setTimeout(() => {
        setStructuredState(studentState);
        setCurrentState(ConversationState.FINISH);
        
        const mockTranscript = [
          { sender: 'bot' as const, text: 'Hi, I am SkillPivot AI. Are you exploring technology skills as a student, representing a college, or something else?', timestamp: Date.now() - 5000 },
          { sender: 'user' as const, text: 'I am a student.', timestamp: Date.now() - 4500 },
          { sender: 'bot' as const, text: 'Got it. Which year of study are you in currently?', timestamp: Date.now() - 4000 },
          { sender: 'user' as const, text: 'I am in my 3rd Year.', timestamp: Date.now() - 3500 },
          { sender: 'bot' as const, text: 'What is your main target after you finish this course?', timestamp: Date.now() - 3000 },
          { sender: 'user' as const, text: 'I want a Core Technical Job.', timestamp: Date.now() - 2500 },
          { sender: 'bot' as const, text: 'Which domain of technology excites you the most?', timestamp: Date.now() - 2000 },
          { sender: 'user' as const, text: 'Robotics and Automation excites me.', timestamp: Date.now() - 1500 },
          { sender: 'bot' as const, text: 'What is the biggest barrier you face in learning these topics?', timestamp: Date.now() - 1000 },
          { sender: 'user' as const, text: 'I have no access to practical labs.', timestamp: Date.now() - 800 },
          { sender: 'bot' as const, text: 'I recommend our Remote Robotics Lab setup to overcome this. What is your full name to proceed?', timestamp: Date.now() - 500 },
          { sender: 'user' as const, text: 'Jane Doe', timestamp: Date.now() - 400 },
          { sender: 'bot' as const, text: 'Got it. What is your mobile or WhatsApp contact number?', timestamp: Date.now() - 350 },
          { sender: 'user' as const, text: '+91 98765 43210', timestamp: Date.now() - 300 },
          { sender: 'bot' as const, text: 'Thank you. What is your email address?', timestamp: Date.now() - 250 },
          { sender: 'user' as const, text: 'jane.doe@univ.edu', timestamp: Date.now() - 200 },
          { sender: 'bot' as const, text: 'Which college or institute are you studying in?', timestamp: Date.now() - 150 },
          { sender: 'user' as const, text: 'Global Engineering Institute', timestamp: Date.now() - 100 },
          { sender: 'bot' as const, text: "I've understood your needs. Would you like me to schedule a demo or connect you on WhatsApp?", timestamp: Date.now() }
        ];

        setTranscript(mockTranscript);
        speakText("I've understood your needs. Would you like me to schedule a demo or connect you on WhatsApp?");
      }, 500);

    } else if (type === 'college') {
      const collegeState: StructuredState = {
        userType: 'College',
        goal: 'Students: 500 - 1000',
        painPoint: 'Existing labs: Theory based only',
        interest: 'Budget: Above 5L',
        intent: 'Pilot Interest: Yes | Recommended: College Pilot',
        leadCaptured: {
          name: 'Prof. Ramesh Kumar',
          phone: '+91 99999 88888',
          email: 'ramesh.k@inst.edu',
          college: 'National Institute of Tech'
        }
      };

      setTimeout(() => {
        setStructuredState(collegeState);
        setCurrentState(ConversationState.FINISH);

        const mockTranscript = [
          { sender: 'bot' as const, text: 'Hi, I am SkillPivot AI. Are you exploring technology skills as a student, representing a college, or something else?', timestamp: Date.now() - 5000 },
          { sender: 'user' as const, text: 'I represent a college.', timestamp: Date.now() - 4500 },
          { sender: 'bot' as const, text: 'Understood. Around how many students are currently enrolled in your department or college?', timestamp: Date.now() - 4000 },
          { sender: 'user' as const, text: '500 to 1000 students.', timestamp: Date.now() - 3500 },
          { sender: 'bot' as const, text: 'Do you have existing practical labs setup for advanced technologies like AI, IoT, or Robotics?', timestamp: Date.now() - 3000 },
          { sender: 'user' as const, text: 'No, theory based only.', timestamp: Date.now() - 2500 },
          { sender: 'bot' as const, text: 'What is the budget scope you are targeting for new hands-on lab deployments?', timestamp: Date.now() - 2000 },
          { sender: 'user' as const, text: 'Above 5 Lakhs.', timestamp: Date.now() - 1500 },
          { sender: 'bot' as const, text: 'Would you be interested in running a short-term trial pilot lab with your students?', timestamp: Date.now() - 1000 },
          { sender: 'user' as const, text: 'Yes, active interest.', timestamp: Date.now() - 800 },
          { sender: 'bot' as const, text: 'I recommend establishing a College Pilot for your department. What is your full name to schedule?', timestamp: Date.now() - 500 },
          { sender: 'user' as const, text: 'Prof. Ramesh Kumar', timestamp: Date.now() - 400 },
          { sender: 'bot' as const, text: 'Got it. What is your mobile or WhatsApp contact number?', timestamp: Date.now() - 350 },
          { sender: 'user' as const, text: '+91 99999 88888', timestamp: Date.now() - 300 },
          { sender: 'bot' as const, text: 'Thank you. What is your email address?', timestamp: Date.now() - 250 },
          { sender: 'user' as const, text: 'ramesh.k@inst.edu', timestamp: Date.now() - 200 },
          { sender: 'bot' as const, text: 'Which institution or college do you represent?', timestamp: Date.now() - 150 },
          { sender: 'user' as const, text: 'National Institute of Tech', timestamp: Date.now() - 100 },
          { sender: 'bot' as const, text: "I've understood your needs. Would you like me to schedule a demo or connect you on WhatsApp?", timestamp: Date.now() }
        ];

        setTranscript(mockTranscript);
        speakText("I've understood your needs. Would you like me to schedule a demo or connect you on WhatsApp?");
      }, 500);
    } else if (type === 'professional') {
      const professionalState: StructuredState = {
        userType: 'Professional',
        goal: 'Role: Senior Developer | Target stack: AI & ML Integration',
        painPoint: 'Schedule constraints, needs weekend self-paced sessions',
        interest: 'Generative AI & LLMs',
        intent: 'Recommended: AI & Machine Learning Program',
        leadCaptured: {
          name: 'Alex Carter',
          phone: '+1 555-0199',
          email: 'alex.carter@techcorp.com',
          college: 'TechCorp Solutions'
        }
      };

      setTimeout(() => {
        setStructuredState(professionalState);
        setCurrentState(ConversationState.FINISH);

        const mockTranscript = [
          { sender: 'bot' as const, text: 'Hi, I am SkillPivot AI. This session may be recorded. Are you exploring technology skills as a student, representing a college, or as a working professional?', timestamp: Date.now() - 5000 },
          { sender: 'user' as const, text: 'I am a working professional.', timestamp: Date.now() - 4500 },
          { sender: 'bot' as const, text: 'Understood. What is your current job role or technical background?', timestamp: Date.now() - 4000 },
          { sender: 'user' as const, text: 'I am a Senior Developer.', timestamp: Date.now() - 3500 },
          { sender: 'bot' as const, text: 'What is the primary career target or tech stack transition you are aiming for?', timestamp: Date.now() - 3000 },
          { sender: 'user' as const, text: 'I want to specialize in AI and ML integration.', timestamp: Date.now() - 2500 },
          { sender: 'bot' as const, text: 'What is the biggest learning barrier or schedule constraint you face while upskilling?', timestamp: Date.now() - 2000 },
          { sender: 'user' as const, text: 'Schedule constraints, I need weekend self-paced sessions.', timestamp: Date.now() - 1500 },
          { sender: 'bot' as const, text: 'I recommend our AI & Machine Learning Program to achieve this goal flexibly. What is your full name to proceed?', timestamp: Date.now() - 1000 },
          { sender: 'user' as const, text: 'Alex Carter', timestamp: Date.now() - 800 },
          { sender: 'bot' as const, text: 'Got it. What is your mobile or WhatsApp contact number?', timestamp: Date.now() - 500 },
          { sender: 'user' as const, text: '+1 555-0199', timestamp: Date.now() - 400 },
          { sender: 'bot' as const, text: 'Thank you. What is your email address?', timestamp: Date.now() - 300 },
          { sender: 'user' as const, text: 'alex.carter@techcorp.com', timestamp: Date.now() - 200 },
          { sender: 'bot' as const, text: 'Which company or current workplace do you represent?', timestamp: Date.now() - 150 },
          { sender: 'user' as const, text: 'TechCorp Solutions', timestamp: Date.now() - 100 },
          { sender: 'bot' as const, text: "I've understood your needs. Would you like me to schedule a demo or connect you on WhatsApp?", timestamp: Date.now() }
        ];

        setTranscript(mockTranscript);
        speakText("I've understood your needs. Would you like me to schedule a demo or connect you on WhatsApp?");
      }, 500);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <UserCheck size={18} className="text-cyan-400" />
        <h3 className="font-semibold text-slate-100 text-sm md:text-base leading-none">Testing Controls</h3>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        Quick-load complete test sessions to review branching states, structured JSON capture outputs, and final CTAs.
      </p>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        <button
          onClick={() => loadPresetProfile('student')}
          className="flex flex-col items-center justify-center p-4 bg-slate-950/50 hover:bg-slate-800/40 border border-slate-800 hover:border-cyan-500/30 rounded-xl transition-all text-center group space-y-2"
        >
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200 block">Student</span>
            <span className="text-[9px] text-slate-400">Remote Labs</span>
          </div>
        </button>

        <button
          onClick={() => loadPresetProfile('college')}
          className="flex flex-col items-center justify-center p-4 bg-slate-950/50 hover:bg-slate-800/40 border border-slate-800 hover:border-indigo-500/30 rounded-xl transition-all text-center group space-y-2"
        >
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
            <School size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200 block">College</span>
            <span className="text-[9px] text-slate-400">Lab Pilot</span>
          </div>
        </button>

        <button
          onClick={() => loadPresetProfile('professional')}
          className="flex flex-col items-center justify-center p-4 bg-slate-950/50 hover:bg-slate-800/40 border border-slate-800 hover:border-emerald-500/30 rounded-xl transition-all text-center group space-y-2"
        >
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
            <Briefcase size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200 block">Professional</span>
            <span className="text-[9px] text-slate-400">Upskill Prog</span>
          </div>
        </button>
      </div>

      {/* Manual Instant Restart */}
      <button
        onClick={resetAgent}
        className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
      >
        <Sparkles size={13} className="text-amber-400" />
        <span>Restart Agent Simulator</span>
      </button>
    </div>
  );
}
