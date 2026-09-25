import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res?.success) {
      onClose();
      setFormData({ email: '', password: '' });
    } else {
      setErrorMessage(res?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E192B]/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white border border-[#E5DEF4] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorator Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#6E56AF]"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B637B] hover:text-[#1E192B] p-1 rounded-full hover:bg-[#F7F4FD] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EBE5F7] text-[#6E56AF] mx-auto flex items-center justify-center mb-3 shadow-md">
            <LogIn className="w-6 h-6 text-[#6E56AF]" />
          </div>
          <h2 className="text-2xl font-black text-[#1E192B]">Welcome Back</h2>
          <p className="text-xs text-[#6B637B] mt-1">
            Sign in to continue your career prep with Interview PrepBridge AI
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-sm text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-sm text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B637B] hover:text-[#1E192B]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-bold text-white bg-[#6E56AF] hover:bg-[#5C469C] rounded-full shadow-lg shadow-[#6E56AF]/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#6B637B]">
          Don't have an account?{' '}
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="font-bold text-[#6E56AF] hover:underline transition-colors"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
