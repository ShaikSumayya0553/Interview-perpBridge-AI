import React from 'react';
import { BrainCircuit, ArrowRight, ArrowUpRight, Cpu, Code2, Layers, CheckCircle2, Award, UserPlus, LogIn } from 'lucide-react';
import heroStudentImg from '../assets/hero_student_prep.jpg';

const LandingPlaceholder = ({ onOpenRegister, onOpenLogin }) => {
  const stats = [
    { value: '12+', label: 'JOBS TRACKED' },
    { value: '45+', label: 'DSA PROBLEMS SOLVED' },
    { value: '95%+', label: 'INTERVIEW READINESS' },
    { value: '4.9★', label: 'AI MOCK FEEDBACK' }
  ];

  const features = [
    {
      title: 'AI MOCK INTERVIEWS',
      description: 'Practice real-time technical interviews with instant AI feedback and scoring.',
      icon: Cpu,
      badge: 'LIVE MOCK STUDIO'
    },
    {
      title: 'DSA PROBLEM TRACKER',
      description: 'Solve and track coding problems by topic, difficulty, and time complexity.',
      icon: Code2,
      badge: 'DSA PRACTICE'
    },
    {
      title: 'JOB APPLICATION TRACKER',
      description: 'Track tech company applications, interview dates, and offer status in one pipeline.',
      icon: Layers,
      badge: 'JOB PIPELINE'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'DISCOVER & TRACK',
      desc: 'Track your job applications, interview stages, and company updates in one place.'
    },
    {
      step: '02',
      title: 'PRACTICE DSA',
      desc: 'Practice important coding problems categorized by topic, difficulty, and complexity.'
    },
    {
      step: '03',
      title: 'AI MOCK INTERVIEWS',
      desc: 'Practice realistic AI voice and text interviews with instant feedback and scorecards.'
    }
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 sm:pt-4">
        {/* Text & Content Column (Desktop: Left | Mobile: Top & Bottom with Middle Image) */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6">
          {/* Badge & Titles */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-5xl lg:text-5xl font-black tracking-tight text-[#1E192B] leading-tight uppercase">
              TECHNICAL <br className="hidden lg:block" />
              <span className="gradient-text font-black">INTERVIEW</span> <br className="hidden lg:block" />
              PREPARATION
            </h1>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE5F7] text-[#6E56AF] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <BrainCircuit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6E56AF]" /> EXECUTIVE TECHNICAL INTERVIEW STUDIO
            </div>

            <p className="text-xs sm:text-base text-[#6B637B] max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
              Bridge the gap between candidate application and top-tier tech offers with <strong className="text-[#1E192B]">Interview PrepBridge AI</strong>. Practice DSA, track jobs, and simulate live AI interviews.
            </p>
          </div>

          {/* MOBILE ONLY: Candidate Image in the Middle */}
          <div className="w-full lg:hidden py-1">
            <div className="relative group max-w-md mx-auto">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#6E56AF] to-[#9A84D6] opacity-35 blur-xl group-hover:opacity-50 transition-opacity"></div>
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#E5DEF4] bg-white shadow-2xl shadow-[#6E56AF]/15">
                <img
                  src={heroStudentImg}
                  alt="Candidate studying for technical interview with PrepBridge AI"
                  className="w-full h-[220px] sm:h-[300px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-1 sm:pt-2">
            <button 
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold text-white bg-[#6E56AF] hover:bg-[#5C469C] rounded-full shadow-lg shadow-[#6E56AF]/25 flex items-center justify-center gap-2 group transition-all"
            >
              START PREPARING NOW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                const capabilitiesEl = document.getElementById('capabilities-section');
                if (capabilitiesEl) capabilitiesEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-bold text-[#6E56AF] bg-white border border-[#E5DEF4] hover:bg-[#EBE5F7] rounded-full shadow-sm transition-all flex items-center justify-center gap-2"
            >
              EXPLORE MODULES
            </button>
          </div>
        </div>

        {/* DESKTOP ONLY: Candidate Image on the Right */}
        <div className="hidden lg:block lg:col-span-6">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#6E56AF] to-[#9A84D6] opacity-35 blur-xl group-hover:opacity-50 transition-opacity"></div>
            <div className="relative overflow-hidden rounded-3xl border-2 border-[#E5DEF4] bg-white shadow-2xl shadow-[#6E56AF]/15">
              <img
                src={heroStudentImg}
                alt="Candidate studying for technical interview with PrepBridge AI"
                className="w-full h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Metrics Stats Row */}
      <div className="bg-white border border-[#E5DEF4] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#6E56AF]/05">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E5DEF4] text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${idx > 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''}`}>
              <span className="text-3xl sm:text-4xl font-black text-[#1E192B] block">{stat.value}</span>
              <span className="text-[10px] font-extrabold text-[#6B637B] tracking-wider uppercase mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid (Interactive Platform Capabilities) */}
      <div id="capabilities-section" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-extrabold text-[#6B637B] tracking-widest uppercase">PLATFORM CAPABILITIES</h2>
            <p className="text-xs text-[#6B637B] mt-1">Explore our core technical interview prep modules below.</p>
          </div>
          <span className="text-xs font-bold text-[#6E56AF] bg-[#EBE5F7] px-3 py-1 rounded-full border border-[#E5DEF4] self-start sm:self-auto">
            Click any module to try
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              onClick={onOpenRegister}
              className="bg-white border border-[#E5DEF4] hover:border-[#6E56AF] rounded-3xl p-6 shadow-lg shadow-[#6E56AF]/05 transition-all flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBE5F7] text-[#6E56AF] flex items-center justify-center group-hover:bg-[#6E56AF] group-hover:text-white transition-all">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#6E56AF] bg-[#F7F4FD] px-2.5 py-1 rounded-full border border-[#E5DEF4]">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#1E192B] mb-2 group-hover:text-[#6E56AF] transition-colors">{feat.title}</h3>
                <p className="text-xs text-[#6B637B] leading-relaxed mb-4">{feat.description}</p>
              </div>

              <div className="pt-4 border-t border-[#E5DEF4] flex items-center justify-between text-xs font-extrabold text-[#6E56AF]">
                <span>Sign in to access module</span>
                <div className="w-8 h-8 rounded-full bg-[#EBE5F7] text-[#6E56AF] flex items-center justify-center group-hover:bg-[#6E56AF] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preparation Process Workflow */}
      <div className="bg-white border border-[#E5DEF4] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#6E56AF]/05 space-y-6">
        <h3 className="text-xs font-extrabold text-[#6B637B] tracking-widest uppercase">PREPARATION PROCESS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processSteps.map((p, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF9FD] border border-[#E5DEF4] hover:bg-[#F7F4FD] transition-colors">
              <span className="text-xs font-mono font-bold text-[#6E56AF] bg-[#EBE5F7] px-3 py-1.5 rounded-xl">
                {p.step}
              </span>
              <div>
                <h4 className="text-xs font-extrabold text-[#1E192B]">{p.title}</h4>
                <p className="text-xs text-[#6B637B] mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPlaceholder;
