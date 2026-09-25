import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  Bot,
  Mic,
  BrainCircuit,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      title: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      ready: true
    },
    {
      title: 'Job Applications',
      path: '/dashboard/jobs',
      icon: Briefcase,
      ready: true
    },
    {
      title: 'DSA Practice',
      path: '/dashboard/dsa',
      icon: Code2,
      ready: true
    },
    {
      title: 'AI Assistant',
      path: '/dashboard/ai-assistant',
      icon: Bot,
      ready: true
    },
    {
      title: 'Mock Interview',
      path: '/dashboard/mock-interview',
      icon: Mic,
      ready: true
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1E192B]/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#E5DEF4] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 px-6 border-b border-[#E5DEF4] flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-9 h-9 rounded-2xl bg-[#6E56AF] flex items-center justify-center shadow-md shadow-[#6E56AF]/25">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-[#1E192B] block">PrepBridge</span>
              <span className="text-[10px] font-bold text-[#6E56AF] uppercase tracking-widest block -mt-1">AI Studio</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-[#6B637B] hover:text-[#1E192B] p-1 rounded-lg hover:bg-[#F7F4FD]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <div className="px-3 mb-2 text-[10px] font-extrabold text-[#6B637B] uppercase tracking-wider">
            Studio Navigation
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#EBE5F7] text-[#6E56AF] shadow-sm border border-[#E5DEF4]'
                    : 'text-[#6B637B] hover:text-[#1E192B] hover:bg-[#F7F4FD]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span>{item.title}</span>
              </div>
              {item.badge && !item.ready && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium bg-[#F7F4FD] text-[#6B637B] border border-[#E5DEF4]">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Pro Banner */}
        <div className="p-4 mx-3 mb-3 rounded-3xl bg-[#F7F4FD] border border-[#E5DEF4] text-center">
          <div className="w-8 h-8 rounded-full bg-[#EBE5F7] text-[#6E56AF] flex items-center justify-center mx-auto mb-2">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-black text-[#1E192B]">PrepBridge Active</h4>
          <p className="text-[11px] text-[#6B637B] mt-0.5">Accelerate your career with AI.</p>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-[#E5DEF4] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#6E56AF] flex items-center justify-center text-white font-bold text-xs uppercase flex-shrink-0 shadow-sm">
              {user?.name ? user.name.slice(0, 2) : 'PB'}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-bold text-[#1E192B] truncate">{user?.name || 'Candidate'}</p>
              <p className="text-[10px] text-[#6B637B] truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-[#6B637B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
