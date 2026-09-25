import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, MapPin, IndianRupee, Link, Calendar } from 'lucide-react';

const JobModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: 'Remote',
    jobType: 'Full-time',
    status: 'Applied',
    salary: '',
    appliedDate: new Date().toISOString().split('T')[0],
    jobUrl: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        position: initialData.position || '',
        location: initialData.location || 'Remote',
        jobType: initialData.jobType || 'Full-time',
        status: initialData.status || 'Applied',
        salary: initialData.salary || '',
        appliedDate: initialData.appliedDate
          ? new Date(initialData.appliedDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        jobUrl: initialData.jobUrl || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        company: '',
        position: '',
        location: 'Remote',
        jobType: 'Full-time',
        status: 'Applied',
        salary: '',
        appliedDate: new Date().toISOString().split('T')[0],
        jobUrl: '',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E192B]/60 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white border border-[#E5DEF4] rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#6E56AF]"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B637B] hover:text-[#1E192B] p-1 rounded-full hover:bg-[#F7F4FD] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-[#1E192B] mb-6">
          {initialData ? 'Edit Job Application' : 'Track New Job Application'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Company & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google, Meta, Stripe"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Job Position *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
                <input
                  type="text"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF]"
                />
              </div>
            </div>
          </div>

          {/* Status & Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Application Stage
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF]"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco / Remote"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-[#6B637B] uppercase tracking-wider">
                  Salary Range
                </label>
                <div className="flex items-center gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.salary.includes('/ annum') && !formData.salary.includes('LPA')) {
                        setFormData({ ...formData, salary: `${formData.salary ? formData.salary.trim() : '₹12,00,000'} / annum` });
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-[#EBE5F7] text-[#6E56AF] font-extrabold hover:bg-[#6E56AF] hover:text-white transition-colors"
                  >
                    Per Annum
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.salary.includes('/ month') && !formData.salary.includes('PM')) {
                        setFormData({ ...formData, salary: `${formData.salary ? formData.salary.trim() : '₹80,000'} / month` });
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-[#EBE5F7] text-[#6E56AF] font-extrabold hover:bg-[#6E56AF] hover:text-white transition-colors"
                  >
                    Per Month
                  </button>
                </div>
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹12,00,000 / annum or ₹80,000 / month"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF]"
                />
              </div>
            </div>
          </div>

          {/* Applied Date & Posting URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Applied Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Posting URL
              </label>
              <div className="relative">
                <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/jobs/..."
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF]"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
              Interview Notes & Contacts
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Recruiter contact, technical interview dates, preparation notes..."
              className="w-full p-3 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF] resize-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-[#6B637B] hover:text-[#1E192B] rounded-full hover:bg-[#F7F4FD] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#6E56AF] hover:bg-[#5C469C] rounded-full shadow-lg shadow-[#6E56AF]/25 transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : initialData ? (
                'Save Changes'
              ) : (
                'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
