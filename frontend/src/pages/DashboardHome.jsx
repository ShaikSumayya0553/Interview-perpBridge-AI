import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Bot,
  Briefcase,
  Code2,
  Mic,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Zap,
  Cpu,
  Layers,
  BrainCircuit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userStats, setUserStats] = useState({
    jobsCount: 0,
    dsaSolved: 0,
    dsaTotal: 0,
    mockCount: 0,
    avgMockScore: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const [jobsRes, dsaRes, mockRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/jobs`, config),
          axios.get(`${API_BASE_URL}/dsa/stats`, config),
          axios.get(`${API_BASE_URL}/mock-interview/history`, config)
        ]);

        let jobsCount = 0;
        if (jobsRes.status === 'fulfilled' && jobsRes.value.data?.success) {
          jobsCount = jobsRes.value.data.count ?? (jobsRes.value.data.jobs?.length || 0);
        }

        let dsaSolved = 0;
        let dsaTotal = 0;
        if (dsaRes.status === 'fulfilled' && dsaRes.value.data?.success) {
          const statsData = dsaRes.value.data.stats || {};
          dsaSolved = statsData.solved || 0;
          dsaTotal = statsData.total || 0;
        }

        let mockCount = 0;
        let avgMockScore = 0;
        if (mockRes.status === 'fulfilled' && mockRes.value.data?.success) {
          const history = mockRes.value.data.history || [];
          mockCount = history.length;
          if (mockCount > 0) {
            const sumScores = history.reduce((sum, h) => sum + (h.overallScore || 0), 0);
            avgMockScore = Math.round(sumScores / mockCount);
          }
        }

        setUserStats({
          jobsCount,
          dsaSolved,
          dsaTotal,
          mockCount,
          avgMockScore,
          loading: false
        });
      } catch (err) {
        console.error('Failed to fetch dashboard overview stats:', err);
        setUserStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      title: 'Jobs Tracked',
      value: userStats.loading ? '...' : String(userStats.jobsCount),
      change: userStats.loading ? 'Fetching stats...' : userStats.jobsCount === 0 ? '0 active applications' : `${userStats.jobsCount} job applications`,
      icon: Briefcase
    },
    {
      title: 'DSA Solved',
      value: userStats.loading ? '...' : `${userStats.dsaSolved}`,
      change: userStats.loading ? 'Fetching stats...' : userStats.dsaTotal === 0 ? '0 problems total' : `${userStats.dsaSolved} of ${userStats.dsaTotal} solved`,
      icon: Code2
    },
    {
      title: 'Mock Sessions',
      value: userStats.loading ? '...' : String(userStats.mockCount),
      change: userStats.loading ? 'Fetching stats...' : userStats.mockCount === 0 ? '0 interview sessions' : `${userStats.avgMockScore}% average rating`,
      icon: Mic
    }
  ];

  const quickActions = [
    {
      title: 'TRACK NEW JOB APPLICATION',
      description: 'Record tech companies, interview stages, salaries, and notes in full pipeline.',
      icon: Briefcase,
      path: '/dashboard/jobs',
      badge: 'JOB TRACKER'
    },
    {
      title: 'PRACTICE DSA QUESTIONS',
      description: 'Solve curated interview problems with Big-O complexities and topic tags.',
      icon: Code2,
      path: '/dashboard/dsa',
      badge: 'DSA PRACTICE'
    },
    {
      title: 'AI PREP COPILOT',
      description: 'Ask technical questions, get code explanations, Big-O analysis, and DSA hints.',
      icon: BrainCircuit,
      path: '/dashboard/ai-assistant',
      badge: 'AI COPILOT'
    },
    {
      title: 'AI MOCK INTERVIEW',
      description: 'Conversational voice & text tech mock interviews with live scoring & scorecards.',
      icon: Mic,
      path: '/dashboard/mock-interview',
      badge: 'LIVE MOCK'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6E56AF] via-[#7C66B9] to-[#6E56AF] p-6 sm:p-8 shadow-xl shadow-[#6E56AF]/15 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5 text-white" /> EXECUTIVE CANDIDATE STUDIO
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome to Interview PrepBridge AI, {user?.name || 'Engineer'}! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed font-medium">
              Track job applications, master LeetCode/DSA problems and prepare with realistic AI mock interviews.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white text-[#6E56AF] flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-wider block">PREP STREAK</span>
              <span className="text-base font-black text-white">Active Candidate 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl bg-white border border-[#E5DEF4] shadow-lg shadow-[#6E56AF]/05 relative overflow-hidden group hover:border-[#6E56AF]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#6B637B] uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-black text-[#1E192B] mt-1">{stat.value}</h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#EBE5F7] text-[#6E56AF] flex items-center justify-center font-bold">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5DEF4] flex items-center gap-1.5 text-[11px] font-semibold text-[#6E56AF]">
              <TrendingUp className="w-3.5 h-3.5 text-[#6E56AF]" />
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-[#6B637B] tracking-widest uppercase flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#6E56AF]" /> PREPBRIDGE STUDIO MODULES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, i) => (
            <div
              key={i}
              onClick={() => navigate(action.path)}
              className="p-6 rounded-3xl bg-white border border-[#E5DEF4] hover:border-[#6E56AF]/50 shadow-lg shadow-[#6E56AF]/05 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EBE5F7] text-[#6E56AF] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#F7F4FD] text-[#6E56AF] font-bold border border-[#E5DEF4]">
                    {action.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#1E192B] group-hover:text-[#6E56AF] transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-[#6B637B] mt-1.5 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <div className="w-9 h-9 rounded-full bg-[#EBE5F7] text-[#6E56AF] flex items-center justify-center group-hover:bg-[#6E56AF] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
