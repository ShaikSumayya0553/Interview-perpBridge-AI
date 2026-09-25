import React from 'react';
import { BrainCircuit, LogIn, UserPlus, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavbarPlaceholder = ({ onOpenLogin, onOpenRegister }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 border-b border-[#E5DEF4] backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#6E56AF] flex items-center justify-center shadow-md shadow-[#6E56AF]/25">
              <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg tracking-tight text-[#1E192B] flex items-center gap-1">
                PrepBridge <span className="gradient-text font-black">AI</span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBE5F7] text-[#6E56AF] uppercase tracking-wider">
                  Executive Studio
                </span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-[#6B637B]">
            <span
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#6E56AF] transition-colors cursor-pointer"
            >
              HOME
            </span>
            <span
              onClick={isAuthenticated ? () => navigate('/dashboard/jobs') : onOpenLogin}
              className="hover:text-[#6E56AF] transition-colors cursor-pointer"
            >
              APPLICATIONS
            </span>
            <span
              onClick={isAuthenticated ? () => navigate('/dashboard/dsa') : onOpenLogin}
              className="hover:text-[#6E56AF] transition-colors cursor-pointer"
            >
              DSA PREP
            </span>
            <span
              onClick={isAuthenticated ? () => navigate('/dashboard/mock-interview') : onOpenLogin}
              className="hover:text-[#6E56AF] transition-colors cursor-pointer"
            >
              MOCK INTERVIEW
            </span>
          </nav>

          {/* Right Actions & Auth Status */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#EBE5F7] border border-[#E5DEF4]">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#6E56AF] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold uppercase">
                    {user?.name ? user.name.charAt(0) : <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-bold text-[#1E192B] hidden sm:inline">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="px-2.5 py-1.5 text-[11px] sm:text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-full border border-rose-200 transition-all flex items-center gap-1 whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={onOpenLogin}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-extrabold text-[#6E56AF] hover:text-[#1E192B] flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Sign In
                </button>
                <button 
                  onClick={onOpenRegister}
                  className="px-3 sm:px-5 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-extrabold text-white bg-[#6E56AF] hover:bg-[#5C469C] rounded-full shadow-md shadow-[#6E56AF]/25 flex items-center gap-1 transition-all whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarPlaceholder;
