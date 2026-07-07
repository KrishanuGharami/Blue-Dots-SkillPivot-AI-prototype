'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Building, 
  Briefcase, 
  Sparkles, 
  Users, 
  Target, 
  Activity, 
  Globe, 
  MapPin, 
  Flame 
} from 'lucide-react';
import IndiaMapSvg from './IndiaMapSvg';

interface City {
  id: string;
  name: string;
  state: string;
  x: number;
  y: number;
  institutions: string[];
  demandSignals: string[];
}

const CITIES_DATA: City[] = [
  {
    id: 'raipur',
    name: 'Raipur',
    state: 'Chhattisgarh',
    x: 320,
    y: 400,
    institutions: ['NIT Raipur', 'Government Engineering College', 'CSVTU Affiliated Colleges'],
    demandSignals: ['Engineering Students', 'Colleges', 'Robotics Labs', 'AI Learning']
  },
  {
    id: 'bhilai',
    name: 'Bhilai',
    state: 'Chhattisgarh',
    x: 305,
    y: 405,
    institutions: ['IIT Bhilai', 'BIT Durg', 'SSTC Bhilai'],
    demandSignals: ['IoT Projects', 'Engineering Students', 'Cloud Computing']
  },
  {
    id: 'bilaspur',
    name: 'Bilaspur',
    state: 'Chhattisgarh',
    x: 325,
    y: 375,
    institutions: ['GGU Bilaspur', 'LCIT Bilaspur', 'SLT Institute'],
    demandSignals: ['Robotics Infrastructure', 'Python & Machine Learning']
  },
  {
    id: 'durg',
    name: 'Durg',
    state: 'Chhattisgarh',
    x: 300,
    y: 410,
    institutions: ['GEC Durg', 'Kalyan PG College', 'Rungta Group'],
    demandSignals: ['AI Learning Courses', 'Undergraduate Engineering']
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    x: 260,
    y: 415,
    institutions: ['VNIT Nagpur', 'YCCE Nagpur', 'RCOEM Nagpur'],
    demandSignals: ['DSA Prep', 'Full-Stack Developers', 'Cybersecurity Bootcamps']
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    x: 180,
    y: 370,
    institutions: ['IIT Indore', 'IET-DAVV', 'SGSITS Indore'],
    demandSignals: ['AI & Data Science', 'Startup Incubators', 'IoT Dev Kits']
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    x: 210,
    y: 355,
    institutions: ['MANIT Bhopal', 'UIT-RGPV', 'LNCT Bhopal'],
    demandSignals: ['Robotics Labs', 'Cloud Computing', 'Web Development']
  },
  {
    id: 'jabalpur',
    name: 'Jabalpur',
    state: 'Madhya Pradesh',
    x: 265,
    y: 350,
    institutions: ['IIITDM Jabalpur', 'JEC Jabalpur', 'GGITS Jabalpur'],
    demandSignals: ['Practical AI Programming', 'Embedded Systems', 'IoT']
  },
  {
    id: 'ranchi',
    name: 'Ranchi',
    state: 'Jharkhand',
    x: 370,
    y: 315,
    institutions: ['BIT Mesra', 'Ranchi University', 'NIFFT Ranchi'],
    demandSignals: ['Practical Technology Education', 'Engineering Students', 'AI Model Training']
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    x: 375,
    y: 250,
    institutions: ['IIT Patna', 'NIT Patna', 'BIT Patna'],
    demandSignals: ['Coding Bootcamps', 'Colleges Seeking AI Labs', 'Up-skilling Program']
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    state: 'Uttar Pradesh',
    x: 310,
    y: 245,
    institutions: ['MNNIT Allahabad', 'IIIT Allahabad', 'Allahabad University'],
    demandSignals: ['DSA & Algorithms', 'AI Learning Tools', 'Hands-on hardware labs']
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    x: 275,
    y: 225,
    institutions: ['IIT Kanpur', 'HBTU Kanpur', 'UIET Kanpur'],
    demandSignals: ['Robotics Infrastructure', 'Embedded AI', 'Cybersecurity']
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    x: 285,
    y: 215,
    institutions: ['IET Lucknow', 'IIIT Lucknow', 'BBDU Lucknow'],
    demandSignals: ['Python & ML', 'IoT Labs', 'Web Design Certifications']
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    x: 325,
    y: 245,
    institutions: ['IIT (BHU) Varanasi', 'SMS Varanasi', 'MGKVP Varanasi'],
    demandSignals: ['Undergrad AI Projects', 'Robotics hardware tools', 'Cloud Platforms']
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    x: 170,
    y: 245,
    institutions: ['MNIT Jaipur', 'LNMIIT Jaipur', 'JECRC University'],
    demandSignals: ['IoT Hardware Labs', 'AI-assisted coding', 'DevOps & Cloud']
  },
  {
    id: 'kota',
    name: 'Kota',
    state: 'Rajasthan',
    x: 180,
    y: 285,
    institutions: ['RTU Kota', 'GEC Kota', 'Career Point University'],
    demandSignals: ['Engineering Aspirants', 'Interactive Tech Kits', 'Coding Competitions']
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    x: 390,
    y: 430,
    institutions: ['IIT Bhubaneswar', 'IIIT Bhubaneswar', 'OUTR Bhubaneswar'],
    demandSignals: ['Robotics Labs', 'Data Engineering Labs', 'Advanced Web Apps']
  },
  {
    id: 'rourkela',
    name: 'Rourkela',
    state: 'Odisha',
    x: 355,
    y: 360,
    institutions: ['NIT Rourkela', 'Padmanava College', 'RIMS Rourkela'],
    demandSignals: ['Affordable Hardware Labs', 'AI Research Tools', 'Cybersecurity Ops']
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    x: 350,
    y: 495,
    institutions: ['Andhra University COE', 'GITAM University', 'GVPCOE Visakhapatnam'],
    demandSignals: ['Cloud Native Apps', 'Robotics Sandbox', 'Undergrad IoT Labs']
  },
  {
    id: 'mysuru',
    name: 'Mysuru',
    state: 'Karnataka',
    x: 170,
    y: 610,
    institutions: ['SJCE Mysuru', 'NIE Mysuru', 'JSS Science University'],
    demandSignals: ['Embedded AI Systems', 'Hardware sandboxes', 'Fullstack Labs']
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    x: 180,
    y: 640,
    institutions: ['PSG Tech', 'CIT Coimbatore', 'Amrita University'],
    demandSignals: ['IoT Industrial Automation', 'Robotics Kit Trials', 'Cloud Computing']
  },
  {
    id: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    x: 100,
    y: 395,
    institutions: ['SVNIT Surat', 'SCET Surat', 'CKP College of Engineering'],
    demandSignals: ['Web Development Labs', 'AI Learning Solutions', 'Coding Practice']
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    state: 'Gujarat',
    x: 105,
    y: 370,
    institutions: ['MS University', 'ITM Baroda University', 'Parul University'],
    demandSignals: ['AI Robotics Modules', 'DSA Practicals', 'Fullstack Workshops']
  },
  {
    id: 'nashik',
    name: 'Nashik',
    state: 'Maharashtra',
    x: 120,
    y: 440,
    institutions: ['KK Wagh Institute', 'NDMVP Engineering', 'Sandip University'],
    demandSignals: ['Machine Learning Tools', 'IoT Sensor Development', 'Upskilling Modules']
  },
  {
    id: 'aurangabad',
    name: 'Aurangabad',
    state: 'Maharashtra',
    x: 155,
    y: 450,
    institutions: ['GECA Aurangabad', 'JNEC Aurangabad', 'PES Engineering'],
    demandSignals: ['Affordable Hardware Labs', 'AI Development Sandbox', 'DSA Basics']
  },
  {
    id: 'mangalore',
    name: 'Mangalore',
    state: 'Karnataka',
    x: 145,
    y: 585,
    institutions: ['NITK Surathkal', 'St Joseph Engineering', 'MITE Mangalore'],
    demandSignals: ['Cybersecurity Labs', 'Robotics Prototypes', 'Embedded IoT Programs']
  },
  {
    id: 'guwahati',
    name: 'Guwahati',
    state: 'Assam',
    x: 500,
    y: 255,
    institutions: ['IIT Guwahati', 'AEC Guwahati', 'Assam Don Bosco University'],
    demandSignals: ['Northeast Tech Hub', 'Robotics Kits Deployment', 'AI Programming']
  },
  {
    id: 'siliguri',
    name: 'Siliguri',
    state: 'West Bengal',
    x: 435,
    y: 240,
    institutions: ['SIT Siliguri', 'North Bengal University', 'Jalpaiguri GEC (Nearby)'],
    demandSignals: ['Coding Competencies', 'Interactive Web Development', 'AI Hardware Kit']
  },
  // Additional Tier-2 & Tier-3 Cities to make the map look beautifully populated
  {
    id: 'gwalior',
    name: 'Gwalior',
    state: 'Madhya Pradesh',
    x: 215,
    y: 275,
    institutions: ['ITM University Gwalior', 'MITS Gwalior', 'IIITM Gwalior'],
    demandSignals: ['AI Algorithms', 'Android Dev Kits', 'IoT Microcontrollers']
  },
  {
    id: 'gaya',
    name: 'Gaya',
    state: 'Bihar',
    x: 380,
    y: 265,
    institutions: ['Gaya College of Engineering', 'Magadh University'],
    demandSignals: ['Affordable AI labs', 'Basics of Programming', 'Robotics Workshops']
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    x: 130,
    y: 290,
    institutions: ['CTA Udaipur', 'Gitanjali Institute', 'MLSU Udaipur'],
    demandSignals: ['Full-stack projects', 'Python AI learning', 'Robotics sandbox']
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    x: 110,
    y: 260,
    institutions: ['IIT Jodhpur', 'MBM Engineering College', 'JIET Jodhpur'],
    demandSignals: ['IoT hardware Kits', 'DSA Training Modules', 'AI Edge Computing']
  },
  {
    id: 'jamshedpur',
    name: 'Jamshedpur',
    state: 'Jharkhand',
    x: 390,
    y: 330,
    institutions: ['NIT Jamshedpur', 'Arka Jain University', 'RVS College'],
    demandSignals: ['IoT Labs', 'AI Tools Integration', 'Full Stack Development']
  },
  {
    id: 'durgapur',
    name: 'Durgapur',
    state: 'West Bengal',
    x: 420,
    y: 315,
    institutions: ['NIT Durgapur', 'BC Roy Engineering College', 'DIATM Durgapur'],
    demandSignals: ['Machine Learning Modules', 'Automation and IoT Kits', 'Cybersecurity Tools']
  },
  {
    id: 'cuttack',
    name: 'Cuttack',
    state: 'Odisha',
    x: 390,
    y: 415,
    institutions: ['Ravenshaw University', 'BOST Cuttack', 'IMIT Cuttack'],
    demandSignals: ['Web Apps Construction', 'DSA Core Prep', 'Colleges seeking Remote Labs']
  },
  {
    id: 'warangal',
    name: 'Warangal',
    state: 'Telangana',
    x: 270,
    y: 475,
    institutions: ['NIT Warangal', 'SR University', 'Kakatiya Institute of Technology'],
    demandSignals: ['Full-Stack Dev Labs', 'Robotics Sandbox', 'Affordable IoT Devices']
  },
  {
    id: 'kozhikode',
    name: 'Kozhikode',
    state: 'Kerala',
    x: 165,
    y: 625,
    institutions: ['NIT Calicut', 'Government Engineering Calicut', 'KMCT College'],
    demandSignals: ['Embedded Systems Labs', 'AI Development Kits', 'Cybersecurity Projects']
  },
  {
    id: 'madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    x: 200,
    y: 670,
    institutions: ['Thiagarajar College of Engineering', 'KLN College', 'Velammal College'],
    demandSignals: ['Mobile App Labs', 'Robotics Modules', 'Cloud Upskilling']
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    x: 155,
    y: 135,
    institutions: ['GNDU Amritsar', 'DAV College', 'Global Institutes'],
    demandSignals: ['DSA Coding Practice', 'Cybersecurity Baselines', 'AI Learning']
  },
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    x: 210,
    y: 160,
    institutions: ['UPES Dehradun', 'DIT University', 'Graphic Era University'],
    demandSignals: ['AI Sandbox Kits', 'Cloud Infrastructure Training', 'IoT Robotics']
  }
];

interface AnimatedStatProps {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  trigger: boolean;
}

const AnimatedStat = ({ value, suffix, label, sublabel, trigger }: AnimatedStatProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 16); // ~60fps
    
    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, trigger]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <span className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] mb-2">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm font-semibold text-slate-800 tracking-tight text-center">{label}</span>
      <span className="text-xs text-slate-500 text-center mt-0.5">{sublabel}</span>
    </div>
  );
};

export default function MarketDiscoveryMap() {
  const [activeCity, setActiveCity] = useState<City | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [statsTriggered, setStatsTriggered] = useState(false);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  
  // Custom tracking for sequential animation loading
  const [animatedDotsCount, setAnimatedDotsCount] = useState(0);

  useEffect(() => {
    // Reveal dots one after another
    const interval = setInterval(() => {
      setAnimatedDotsCount(prev => {
        if (prev >= CITIES_DATA.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Trigger statistics counter when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-white text-slate-900 py-24 px-6 md:px-12 border-y border-slate-100 overflow-hidden relative">
      {/* Subtle blue background gradients */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-12 left-1/4 w-[500px] h-[500px] bg-blue-400/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-[11px] font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span>🔵 Blue Dots Economy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Mapping India's Next Generation of Tech Talent
          </h2>
          <p className="text-slate-500 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            Every blue dot represents a Tier-2 or Tier-3 city where students, colleges, and educators are looking for affordable, AI-powered, hands-on technology education. SkillPivot helps connect this hidden demand with remote hardware labs and practical learning experiences.
          </p>
        </div>

        {/* Main interactive split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Map Area */}
          <div className="lg:col-span-7 flex justify-center items-center relative bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/40 min-h-[500px]">
            <div className="w-full max-w-[500px] relative select-none">
              
              {/* India Map SVG Component */}
              <IndiaMapSvg 
                hoveredState={hoveredState} 
                setHoveredState={setHoveredState} 
                className="w-full h-auto drop-shadow-[0_8px_24px_rgba(37,99,235,0.03)]"
              />

              {/* Glowing Interactive City Dots */}
              <div className="absolute inset-0 pointer-events-none">
                {CITIES_DATA.map((city, idx) => {
                  const isVisible = idx < animatedDotsCount;
                  if (!isVisible) return null;
                  
                  const isCurrent = activeCity?.id === city.id;

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
                      onMouseEnter={() => setActiveCity(city)}
                      onMouseLeave={() => setActiveCity(null)}
                    >
                      {/* Pulse Ripple Effect */}
                      <span className="absolute inline-flex h-6 w-6 rounded-full bg-blue-500/20 -translate-x-[6px] -translate-y-[6px] animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
                      
                      {/* Glowing core dot */}
                      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md cursor-pointer transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-[#2563EB] scale-125 shadow-blue-500/50 shadow-lg' 
                          : 'bg-[#2563EB]/85 hover:bg-[#2563EB] hover:scale-115'
                      }`} />
                    </div>
                  );
                })}
              </div>

              {/* State Hover Status Label */}
              {hoveredState && (
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3.5 py-1.5 border border-slate-100 rounded-xl text-xs font-semibold text-slate-500 pointer-events-none shadow-sm flex items-center space-x-1.5 animate-fadeIn">
                  <MapPin size={12} className="text-[#2563EB] animate-pulse" />
                  <span>Region: {hoveredState}</span>
                </div>
              )}

              {/* Glassmorphism Floating Tooltip */}
              {activeCity && (
                <div 
                  className="absolute pointer-events-none bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-blue-900/10 p-5 w-64 transition-all duration-300 z-50 animate-fadeInUp"
                  style={{
                    left: `${(activeCity.x / 612) * 100}%`,
                    top: `${(activeCity.y / 696) * 100}%`,
                    transform: 'translate(-50%, -108%)', // Placed directly above the city dot
                  }}
                >
                  {/* Glassmorphism arrow decoration */}
                  <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/85 border-r border-b border-white/50 rotate-45" />

                  <div className="space-y-3.5">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">{activeCity.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-[#2563EB] tracking-wider block mt-0.5">{activeCity.state}</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block">Potential Institutions</span>
                      <ul className="text-slate-700 text-xs font-medium space-y-1 list-disc pl-4">
                        {activeCity.institutions.map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Demand Signals</span>
                      <div className="flex flex-wrap gap-1">
                        {activeCity.demandSignals.map((signal, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-bold text-[#2563EB] border border-blue-100"
                          >
                            {signal === 'Robotics Labs' || signal === 'Robotics Infrastructure' ? '🤖 ' : ''}
                            {signal === 'AI Learning' || signal === 'Python & Machine Learning' || signal === 'AI & Data Science' ? '🧠 ' : ''}
                            {signal === 'Engineering Students' ? '👨‍🎓 ' : ''}
                            {signal === 'Colleges' || signal === 'Colleges Seeking AI Labs' ? '🏫 ' : ''}
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN: Premium Information Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                What Each Blue Dot Represents
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                SkillPivot discovers educational opportunities and unlocks localized access to high-demand AI and computing sandboxes.
              </p>
            </div>

            {/* Feature Cards Grid (2x2 Glassmorphic Theme) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1 */}
              <div className="p-5 bg-white border border-slate-100 hover:border-blue-200 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-[#2563EB] w-fit group-hover:scale-105 transition-transform duration-300">
                    <GraduationCap size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">🎓 Student Demand</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Students looking for hands-on learning in AI, Robotics, IoT, Web Development, Cybersecurity, DSA, Cloud Computing and emerging technologies.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 bg-white border border-slate-100 hover:border-blue-200 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-[#2563EB] w-fit group-hover:scale-105 transition-transform duration-300">
                    <Building size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">🏛 Institution Opportunity</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Colleges seeking AI-powered remote hardware labs, robotics infrastructure and practical learning solutions.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-5 bg-white border border-slate-100 hover:border-blue-200 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-[#2563EB] w-fit group-hover:scale-105 transition-transform duration-300">
                    <Briefcase size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">💼 Professional Upskilling</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Working professionals looking to reskill through flexible, project-based technology programs.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-5 bg-white border border-slate-100 hover:border-blue-200 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-[#2563EB] w-fit group-hover:scale-105 transition-transform duration-300">
                    <Sparkles size={20} />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">🤖 AI Discovery Signals</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Every interaction with SkillPivot AI helps identify regional technology interests, learning demand and institutional readiness.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Statistics Area */}
        <div ref={statsSectionRef} className="pt-8 border-t border-slate-100 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            
            <AnimatedStat 
              value={1000} 
              suffix="+" 
              label="Engineering Colleges" 
              sublabel="Target academic programs" 
              trigger={statsTriggered}
            />

            <AnimatedStat 
              value={500} 
              suffix="K+" 
              label="Students Capacity" 
              sublabel="Accessing remote sandboxes" 
              trigger={statsTriggered}
            />

            <AnimatedStat 
              value={100} 
              suffix="+" 
              label="Target Cities" 
              sublabel="Tier-2 and Tier-3 activated" 
              trigger={statsTriggered}
            />

            {/* AI Voice discovery / Remote labs available anywhere badge card */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#2563EB] to-indigo-700 border border-transparent rounded-2xl shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 text-white text-center">
              <Flame size={28} className="text-amber-300 mb-2 animate-bounce" />
              <span className="text-sm font-extrabold tracking-tight">AI Powered Voice Discovery</span>
              <span className="text-xs text-blue-100 mt-1 text-center">Remote Labs Available Anywhere</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
