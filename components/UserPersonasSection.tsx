'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  Code2,
  Bot,
  Wifi,
  Database,
  Shield,
  Layers,
  Terminal,
  Server,
  Smartphone,
  Palette,
  Binary,
  BrainCircuit,
  BarChart3,
  Presentation
} from 'lucide-react';

// Persona Data Definition
interface Persona {
  id: string;
  badge: string;
  icon: React.ReactNode;
  title: string;
  headline: string;
  description: string;
  illustration: string;
  chipsHeader: string;
  allChips: { label: string; icon?: React.ReactNode }[];
  benefits: string[];
  primaryCTA: string;
  secondaryCTA: string;
  colorTheme: {
    badgeBg: string;
    badgeText: string;
    borderHover: string;
    glow: string;
    iconBg: string;
    iconColor: string;
    buttonBg: string;
    buttonHover: string;
    chipBorderHover: string;
    checkColor: string;
  };
}

export default function UserPersonasSection() {
  const [expandedCard, setExpandedCard] = useState<Record<string, boolean>>({
    students: false,
    colleges: false,
    professionals: false,
  });

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const toggleExpand = (cardId: string) => {
    setExpandedCard(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const personas: Persona[] = [
    {
      id: 'students',
      badge: '🎓 Students',
      icon: <GraduationCap className="w-6 h-6 text-purple-400" />,
      title: 'Students',
      headline: 'Hands-on Learning for Future Tech Careers',
      description: 'Learn industry-ready skills through AI-powered personalized learning paths, real-world projects, and remote access to robotics, IoT, and hardware labs.',
      illustration: '/student_persona.png',
      chipsHeader: 'Learn & Build in Tech Fields:',
      allChips: [
        { label: 'Web Development', icon: <Code2 className="w-3.5 h-3.5" /> },
        { label: 'Robotics', icon: <Bot className="w-3.5 h-3.5" /> },
        { label: 'Internet of Things (IoT)', icon: <Wifi className="w-3.5 h-3.5" /> },
        { label: 'Artificial Intelligence', icon: <Sparkles className="w-3.5 h-3.5" /> },
        { label: 'Data Structures & Algorithms', icon: <Binary className="w-3.5 h-3.5" /> },
        { label: 'Cybersecurity', icon: <Shield className="w-3.5 h-3.5" /> },
        { label: 'Cloud Computing', icon: <Server className="w-3.5 h-3.5" /> },
        { label: 'DevOps', icon: <Layers className="w-3.5 h-3.5" /> },
        { label: 'Mobile App Development', icon: <Smartphone className="w-3.5 h-3.5" /> },
        { label: 'UI/UX Design', icon: <Palette className="w-3.5 h-3.5" /> },
        { label: 'Embedded Systems', icon: <Terminal className="w-3.5 h-3.5" /> },
        { label: 'Machine Learning', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
        { label: 'Data Science', icon: <Database className="w-3.5 h-3.5" /> },
        { label: 'Aptitude & Interview Prep', icon: <Presentation className="w-3.5 h-3.5" /> }
      ],
      benefits: [
        'AI-powered personalized learning roadmap',
        'Learn by building real-world projects',
        'Remote access to physical robotics & IoT labs',
        'Live mentorship from industry experts',
        'Internship & placement preparation',
        'Portfolio building',
        'Skill assessments & certifications'
      ],
      primaryCTA: 'Start Learning',
      secondaryCTA: 'Explore Your Learning Path',
      colorTheme: {
        badgeBg: 'bg-purple-500/10 border-purple-500/20',
        badgeText: 'text-purple-400',
        borderHover: 'group-hover:from-purple-500 group-hover:to-indigo-500',
        glow: 'bg-purple-500/10 group-hover:bg-purple-500/20',
        iconBg: 'bg-purple-950/40 border border-purple-800/40',
        iconColor: 'text-purple-400',
        buttonBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/20',
        buttonHover: 'hover:from-purple-500 hover:to-indigo-500',
        chipBorderHover: 'hover:border-purple-500/45 hover:bg-purple-500/5 hover:text-purple-300',
        checkColor: 'text-purple-400 bg-purple-950/50 border border-purple-850'
      }
    },
    {
      id: 'colleges',
      badge: '🏛 Colleges & Universities',
      icon: <Building2 className="w-6 h-6 text-blue-400" />,
      title: 'Colleges / Universities',
      headline: 'AI-Powered Remote Hardware Labs for Institutions',
      description: 'Enable your students to remotely access robotics, IoT, embedded systems, and electronics hardware anytime without investing in expensive physical infrastructure.',
      illustration: '/college_persona.png',
      chipsHeader: 'Power Your Institution:',
      allChips: [
        { label: 'Remote Robotics Labs', icon: <Bot className="w-3.5 h-3.5" /> },
        { label: 'IoT Labs', icon: <Wifi className="w-3.5 h-3.5" /> },
        { label: 'Embedded Systems', icon: <Terminal className="w-3.5 h-3.5" /> },
        { label: 'Electronics Labs', icon: <Cpu className="w-3.5 h-3.5" /> },
        { label: 'AI Lab Management', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
        { label: 'Remote Practical Sessions', icon: <Layers className="w-3.5 h-3.5" /> },
        { label: 'Cloud Hardware Access', icon: <Server className="w-3.5 h-3.5" /> },
        { label: 'Curriculum Integration', icon: <BookOpen className="w-3.5 h-3.5" /> }
      ],
      benefits: [
        'Affordable Hardware-as-a-Service model',
        'AI-powered Lab Management & Scheduling',
        '24×7 Remote Hardware Access for learners',
        'Practical learning beyond typical classrooms',
        'Faculty Dashboard for assignments',
        'Student Progress & grading analytics',
        'Institution-wide seamless deployment',
        'Easy integration with existing curriculum'
      ],
      primaryCTA: 'Book Institution Demo',
      secondaryCTA: 'Transform Your Campus Labs',
      colorTheme: {
        badgeBg: 'bg-blue-500/10 border-blue-500/20',
        badgeText: 'text-blue-400',
        borderHover: 'group-hover:from-blue-500 group-hover:to-cyan-500',
        glow: 'bg-blue-500/10 group-hover:bg-blue-500/20',
        iconBg: 'bg-blue-950/40 border border-blue-800/40',
        iconColor: 'text-blue-400',
        buttonBg: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-blue-500/20',
        buttonHover: 'hover:from-blue-500 hover:to-cyan-500',
        chipBorderHover: 'hover:border-blue-500/45 hover:bg-blue-500/5 hover:text-blue-300',
        checkColor: 'text-blue-400 bg-blue-950/50 border border-blue-850'
      }
    },
    {
      id: 'professionals',
      badge: '💼 Working Professionals',
      icon: <Briefcase className="w-6 h-6 text-emerald-400" />,
      title: 'Working Professionals',
      headline: 'Upskill Faster. Grow Your Career.',
      description: 'Stay ahead with AI-powered career learning, practical projects, and industry-focused technology programs designed for working professionals.',
      illustration: '/professional_persona.png',
      chipsHeader: 'Advance Your Career:',
      allChips: [
        { label: 'AI & Machine Learning', icon: <Sparkles className="w-3.5 h-3.5" /> },
        { label: 'Full Stack Development', icon: <Code2 className="w-3.5 h-3.5" /> },
        { label: 'Cloud Computing', icon: <Server className="w-3.5 h-3.5" /> },
        { label: 'DevOps', icon: <Layers className="w-3.5 h-3.5" /> },
        { label: 'Cybersecurity', icon: <Shield className="w-3.5 h-3.5" /> },
        { label: 'Data Science', icon: <Database className="w-3.5 h-3.5" /> },
        { label: 'Generative AI', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
        { label: 'Leadership Skills', icon: <BarChart3 className="w-3.5 h-3.5" /> }
      ],
      benefits: [
        'Personalized AI learning assistant 24/7',
        'Flexible, self-paced learning pathways',
        'Weekend live sessions with mentors',
        'Production-grade industry projects',
        'Dedicated 1-on-1 career mentorship',
        'Industry-recognized certifications',
        'Resume rebuilding & interview preparation',
        'End-to-end job transition support'
      ],
      primaryCTA: 'Upskill Now',
      secondaryCTA: 'Advance Your Career',
      colorTheme: {
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
        badgeText: 'text-emerald-400',
        borderHover: 'group-hover:from-emerald-500 group-hover:to-teal-500',
        glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
        iconBg: 'bg-emerald-950/40 border border-emerald-800/40',
        iconColor: 'text-emerald-400',
        buttonBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/20',
        buttonHover: 'hover:from-emerald-500 hover:to-teal-500',
        chipBorderHover: 'hover:border-emerald-500/45 hover:bg-emerald-500/5 hover:text-emerald-300',
        checkColor: 'text-emerald-400 bg-emerald-950/50 border border-emerald-850'
      }
    }
  ];

  const highlights = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-purple-400" />,
      title: '🤖 AI-Powered Personalized Learning',
      desc: 'Smart roadmaps tailored to your pace, strengths, and professional goals.',
      color: 'purple'
    },
    {
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      title: 'Remote Hardware Labs',
      desc: 'Access real physical IoT and robotics boards via cloud connection anytime.',
      color: 'blue'
    },
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      title: 'Industry-Aligned Curriculum',
      desc: 'Content co-designed with top experts to ensure absolute job readiness.',
      color: 'emerald'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-cyan-400" />,
      title: 'Career-Focused Learning',
      desc: 'Intensive interview, resume, and profile optimization to land your dream role.',
      color: 'cyan'
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#070b13] overflow-hidden select-none border-t border-slate-900"
      id="learning-journeys"
    >
      {/* Dynamic inline styles for smooth keyframe animations and glows */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(6px) rotate(-1deg); }
        }
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(1.12); opacity: 0.15; }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 10s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Blobs */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none animate-subtle-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none animate-subtle-pulse" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-subtle-pulse" style={{ animationDelay: '6s' }} />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header Section with Scroll-Triggered Fade-up */}
        <div 
          className={`text-center max-w-3xl space-y-6 transition-all duration-700 ease-out transform ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-350 text-xs font-semibold tracking-wide shadow-md transition-all hover:border-indigo-500/30">
            <span className="text-indigo-400">✨</span>
            <span>Built for Every Learner</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            One Platform.<br className="sm:hidden" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Multiple Learning Journeys.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you're learning new technologies, empowering your institution, or advancing your career, SkillPivot provides AI-powered personalized learning and remote access to real hardware labs.
          </p>
        </div>

        {/* Persona Cards Grid */}
        <div 
          className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 sm:mt-20 w-full transition-all duration-1000 ease-out transform ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          {personas.map((persona, index) => {
            const isExpanded = expandedCard[persona.id];
            // Display first 6 chips, or all if expanded
            const visibleChips = isExpanded ? persona.allChips : persona.allChips.slice(0, 6);
            const hasMoreChips = persona.allChips.length > 6;

            return (
              <div 
                key={persona.id}
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`relative group rounded-[24px] p-[1.5px] bg-gradient-to-b from-slate-800/80 to-slate-900/30 hover:to-slate-800/50 transition-all duration-500 shadow-xl hover:shadow-2xl flex flex-col justify-between overflow-hidden bg-clip-border h-full ${
                  persona.id === 'students' ? 'hover:from-purple-500/30 hover:to-indigo-500/30 hover:shadow-purple-500/5' :
                  persona.id === 'colleges' ? 'hover:from-blue-500/30 hover:to-cyan-500/30 hover:shadow-blue-500/5' :
                  'hover:from-emerald-500/30 hover:to-teal-500/30 hover:shadow-emerald-500/5'
                }`}
              >
                {/* Glow Overlay behind cards on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-transparent -z-10" />
                <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-[100px] transition-opacity duration-500 opacity-20 group-hover:opacity-40 -z-10 ${
                  persona.id === 'students' ? 'bg-purple-500' :
                  persona.id === 'colleges' ? 'bg-blue-500' :
                  'bg-emerald-500'
                }`} />

                {/* Card Inner Content */}
                <div className="flex-1 rounded-[23px] bg-[#0b0f19]/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between space-y-8 z-10">
                  
                  {/* Top Portion: Badge, Info, Illustration */}
                  <div className="space-y-6">
                    {/* Header: Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl ${persona.colorTheme.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                        {persona.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${persona.colorTheme.badgeBg} ${persona.colorTheme.badgeText}`}>
                        {persona.badge}
                      </span>
                    </div>

                    {/* Content text & Illustration Side-by-Side */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 items-center">
                      <div className="space-y-2 col-span-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">
                          {persona.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                          {persona.headline}
                        </p>
                      </div>

                      {/* Illustration Container */}
                      <div className="relative h-28 w-full flex items-center justify-center col-span-1 rounded-2xl overflow-hidden bg-slate-950/40 border border-slate-900/60 p-1">
                        <Image 
                          src={persona.illustration} 
                          alt={`${persona.title} illustration`}
                          fill
                          sizes="(max-width: 640px) 100vw, 150px"
                          priority
                          className="object-cover rounded-xl transition-all duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                        />
                        {/* Soft mask overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none" />
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed min-h-[60px]">
                      {persona.description}
                    </p>

                    {/* Chips Section with expandable micro-interaction */}
                    <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-900/80 space-y-3">
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                        {persona.chipsHeader}
                      </span>
                      <div className="flex flex-wrap gap-2 transition-all duration-300">
                        {visibleChips.map((chip, idx) => (
                          <div 
                            key={idx}
                            className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 rounded-lg transition-all duration-300 cursor-default select-none ${persona.colorTheme.chipBorderHover} shadow-sm`}
                          >
                            {chip.icon && <span className="text-slate-400 group-hover:text-slate-200">{chip.icon}</span>}
                            <span>{chip.label}</span>
                          </div>
                        ))}

                        {/* Interactive toggle chip */}
                        {hasMoreChips && (
                          <button
                            onClick={() => toggleExpand(persona.id)}
                            className="flex items-center space-x-1 px-2.5 py-1 text-xs text-indigo-400 hover:text-white bg-indigo-950/20 hover:bg-indigo-600/20 border border-indigo-900/40 rounded-lg transition-all duration-300 font-semibold cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? "Collapse chips" : "Expand chips"}
                          >
                            <span>{isExpanded ? 'Show Less' : `+ ${persona.allChips.length - 6} more`}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="space-y-3">
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                        Benefits:
                      </span>
                      <ul className="space-y-2.5" role="list">
                        {persona.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-sm text-slate-350">
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${persona.colorTheme.checkColor}`}>
                              <Check className="w-3.5 h-3.5" />
                            </span>
                            <span className="leading-tight">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Bottom Portion: CTA Buttons */}
                  <div className="space-y-4 pt-4 border-t border-slate-900/60">
                    <Link 
                      href={`/dashboard?persona=${persona.id === 'students' ? 'student' : persona.id === 'colleges' ? 'college' : 'professional'}`}
                      className={`w-full py-4 px-6 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 group/btn transition-all duration-300 shadow-md ${persona.colorTheme.buttonBg} ${persona.colorTheme.buttonHover} active:scale-[0.98] outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-indigo-500`}
                    >
                      <span>{persona.primaryCTA}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1.5 transition-transform" />
                    </Link>
                    <Link 
                      href={`/dashboard?persona=${persona.id === 'students' ? 'student' : persona.id === 'colleges' ? 'college' : 'professional'}`}
                      className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium hover:underline block py-1"
                    >
                      {persona.secondaryCTA}
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Highlights Banner */}
        <div 
          className={`w-full mt-24 sm:mt-32 p-[1px] rounded-[24px] bg-gradient-to-r from-slate-800/60 via-slate-900/40 to-slate-800/60 transition-all duration-700 ease-out transform ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="rounded-[23px] bg-[#0b0f19]/80 backdrop-blur-2xl px-6 py-10 sm:p-10 border border-slate-950/85">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {highlights.map((highlight, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 group/highlight hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex-shrink-0 transition-colors duration-300 group-hover/highlight:border-slate-700">
                    <div className="animate-float-slow">
                      {highlight.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-slate-200 group-hover/highlight:text-white transition-colors">
                      {highlight.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {highlight.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
