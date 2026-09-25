import React, { useState } from 'react';
import { X, Mail, Lock, User, UserPlus, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const hasLength = formData.password.length >= 6;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!hasLength) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setErrorMessage('Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*).');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const res = await register(formData.name, formData.email, formData.password);
    setLoading(false);

    if (res?.success) {
      onClose();
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    } else {
      setErrorMessage(res?.message || 'Registration failed. Please try again.');
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
            <UserPlus className="w-6 h-6 text-[#6E56AF]" />
          </div>
          <h2 className="text-2xl font-black text-[#1E192B]">Create Account</h2>
          <p className="text-xs text-[#6B637B] mt-1">
            Join Interview PrepBridge AI & elevate your technical career
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
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-sm text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF] transition-all"
              />
            </div>
          </div>

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

            {/* Password Complexity Checklist */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px] font-medium text-[#6B637B]">
              <div className={`flex items-center gap-1 ${hasLength ? 'text-emerald-600 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasLength ? 'text-emerald-500' : 'text-gray-300'}`} />
                <span>6+ Characters</span>
              </div>
              <div className={`flex items-center gap-1 ${hasUpper && hasLower ? 'text-emerald-600 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasUpper && hasLower ? 'text-emerald-500' : 'text-gray-300'}`} />
                <span>Upper & Lowercase</span>
              </div>
              <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-500' : 'text-gray-300'}`} />
                <span>1+ Number (0-9)</span>
              </div>
              <div className={`flex items-center gap-1 ${hasSpecial ? 'text-emerald-600 font-bold' : ''}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasSpecial ? 'text-emerald-500' : 'text-gray-300'}`} />
                <span>1+ Special (!@#$)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-sm text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF] transition-all"
              />
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
                <UserPlus className="w-4 h-4" /> Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#6B637B]">
          Already have an account?{' '}
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="font-bold text-[#6E56AF] hover:underline transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
