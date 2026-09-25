import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, User, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ setIsMobileOpen, healthStatus = 'healthy' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-[#E5DEF4] px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left section: Mobile menu toggle + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden text-[#6B637B] hover:text-[#1E192B] p-2 rounded-xl hover:bg-[#F7F4FD] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
          <input
            type="text"
            placeholder="Search topics, DSA problems, applications..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F4FD] border border-[#E5DEF4] rounded-full text-xs text-[#1E192B] placeholder-[#6B637B] focus:outline-none focus:border-[#6E56AF] transition-all"
          />
        </div>
      </div>

      {/* Right section: User Menu */}
      <div className="flex items-center gap-3">

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-[#F7F4FD] transition-colors border border-transparent hover:border-[#E5DEF4]"
          >
            <div className="w-8 h-8 rounded-full bg-[#6E56AF] flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
              {user?.name ? user.name.slice(0, 2) : 'PB'}
            </div>
            <span className="hidden md:inline text-xs font-bold text-[#1E192B]">
              {user?.name || 'Candidate'}
            </span>
            <ChevronDown className="w-4 h-4 text-[#6B637B]" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5DEF4] rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-[#E5DEF4]">
                <p className="text-xs font-bold text-[#1E192B] truncate">{user?.name}</p>
                <p className="text-[11px] text-[#6B637B] truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#EBE5F7] text-[#6E56AF] text-[10px] font-bold border border-[#E5DEF4]">
                  <ShieldCheck className="w-3 h-3 text-[#6E56AF]" /> Certified Candidate
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-[#6B637B] hover:text-[#6E56AF] hover:bg-[#F7F4FD] flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-[#6E56AF]" /> Dashboard Overview
                </button>
              </div>

              <div className="border-t border-[#E5DEF4] pt-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
