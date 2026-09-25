import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NavbarPlaceholder from './components/NavbarPlaceholder';
import LandingPlaceholder from './pages/LandingPlaceholder';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import JobTracker from './pages/JobTracker';
import DsaTracker from './pages/DsaTracker';
import AiAssistant from './pages/AiAssistant';
import MockInterview from './pages/MockInterview';
import { AuthProvider, useAuth } from './context/AuthContext';
import { API_BASE_URL } from './config/api';



function LandingPageWrapper() {
  const [healthData, setHealthData] = useState(null);
  const [healthStatus, setHealthStatus] = useState('checking');
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openLogin) {
      setIsLoginOpen(true);
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const fetchHealthStatus = async () => {
    setLoadingHealth(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      if (response.data && response.data.success) {
        setHealthData(response.data);
        setHealthStatus('healthy');
      } else {
        setHealthStatus('error');
      }
    } catch (err) {
      console.error('Backend health check error:', err);
      setHealthStatus('error');
      setHealthData(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4FD] text-[#1E192B] flex flex-col font-sans">
      <NavbarPlaceholder 
        healthStatus={healthStatus} 
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      <main className="flex-grow">
        <LandingPlaceholder 
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />
      </main>

      <footer className="border-t border-[#E5DEF4] bg-[#F7F4FD] py-8 text-center text-xs text-[#6B637B]">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Interview PrepBridge AI. Built for Software Engineers & Technical Candidates.</p>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page Route */}
          <Route path="/" element={<LandingPageWrapper />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="jobs" element={<JobTracker />} />
            <Route path="dsa" element={<DsaTracker />} />
            <Route path="ai-assistant" element={<AiAssistant />} />
            <Route path="mock-interview" element={<MockInterview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
