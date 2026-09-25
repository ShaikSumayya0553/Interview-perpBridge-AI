import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F4FD] text-[#1E192B] flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header setIsMobileOpen={setIsMobileOpen} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer Bar */}
        <footer className="py-4 px-8 border-t border-[#E5DEF4] bg-[#F7F4FD] text-center text-xs text-[#6B637B]">
          Interview PrepBridge AI Platform • Executive Technical Interview Studio
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
