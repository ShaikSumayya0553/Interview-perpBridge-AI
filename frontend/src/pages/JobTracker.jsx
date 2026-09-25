import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Briefcase,
  Plus,
  Search,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import JobModal from '../components/jobs/JobModal';
import { API_BASE_URL } from '../config/api';

const JobTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`, {
        params: {
          search: search || undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined
        }
      });
      if (response.data && response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job applications. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateOrUpdateJob = async (formData) => {
    setModalLoading(true);
    try {
      if (editingJob) {
        const response = await axios.put(`${API_BASE_URL}/jobs/${editingJob._id}`, formData);
        if (response.data && response.data.success) {
          setJobs(jobs.map((j) => (j._id === editingJob._id ? response.data.job : j)));
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/jobs`, formData);
        if (response.data && response.data.success) {
          setJobs([response.data.job, ...jobs]);
        }
      }
      setIsModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      console.error('Error saving job:', err);
      alert(err.response?.data?.message || 'Failed to save job application.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/jobs/${jobId}`, { status: newStatus });
      if (response.data && response.data.success) {
        setJobs(jobs.map((j) => (j._id === jobId ? response.data.job : j)));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
      if (response.data && response.data.success) {
        setJobs(jobs.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const appliedCount = jobs.filter((j) => j.status === 'Applied').length;
  const interviewingCount = jobs.filter((j) => j.status === 'Interviewing').length;
  const offeredCount = jobs.filter((j) => j.status === 'Offered').length;
  const rejectedCount = jobs.filter((j) => j.status === 'Rejected').length;

  const statusTabs = ['All', 'Applied', 'Interviewing', 'Offered', 'Rejected'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBE5F7] text-[#6E56AF] text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5 text-[#6E56AF]" /> Application Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E192B] tracking-tight">
            Job Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#6B637B] mt-1">
            Track and manage your job applications effortlessly.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingJob(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 rounded-full bg-[#6E56AF] hover:bg-[#5C469C] text-white font-bold text-xs shadow-lg shadow-[#6E56AF]/25 transition-all flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-[#E5DEF4] shadow-lg shadow-[#6E56AF]/05">
          <div className="flex items-center justify-between text-[#6B637B] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Applied</span>
            <Clock className="w-4 h-4 text-[#6E56AF]" />
          </div>
          <span className="text-2xl font-black text-[#1E192B]">{appliedCount}</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-purple-200 shadow-lg shadow-[#6E56AF]/05">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Interviewing</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-[#1E192B]">{interviewingCount}</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-emerald-200 shadow-lg shadow-[#6E56AF]/05">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Offered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-[#1E192B]">{offeredCount}</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-rose-200 shadow-lg shadow-[#6E56AF]/05">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-black text-[#1E192B]">{rejectedCount}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#E5DEF4] shadow-lg shadow-[#6E56AF]/05">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === tab
                  ? 'bg-[#6E56AF] text-white shadow-md'
                  : 'bg-[#F7F4FD] text-[#6B637B] hover:text-[#1E192B] hover:bg-[#EBE5F7]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or position..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F4FD] border border-[#E5DEF4] rounded-full text-xs text-[#1E192B] placeholder-[#6B637B] focus:outline-none focus:border-[#6E56AF]"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Job Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#6B637B]">
          <div className="w-8 h-8 border-4 border-[#6E56AF]/30 border-t-[#6E56AF] rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-bold">Loading applications...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={(j) => {
                setEditingJob(j);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteJob}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 rounded-3xl bg-white border border-[#E5DEF4] text-center space-y-4 shadow-xl shadow-[#6E56AF]/05">
          <div className="w-12 h-12 rounded-2xl bg-[#EBE5F7] text-[#6E56AF] mx-auto flex items-center justify-center shadow-md">
            <Briefcase className="w-6 h-6 text-[#6E56AF]" />
          </div>
          <h3 className="text-lg font-bold text-[#1E192B]">No Job Applications Found</h3>
          <p className="text-xs text-[#6B637B] max-w-sm mx-auto">
            {search || selectedStatus !== 'All'
              ? 'No applications match your current search or status filter.'
              : 'You have not added any job applications yet. Click below to add your first job!'}
          </p>
          <button
            onClick={() => {
              setEditingJob(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-2.5 rounded-full bg-[#6E56AF] text-white font-bold text-xs shadow-lg hover:opacity-95 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>
      )}

      {/* Modal Form */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdateJob}
        initialData={editingJob}
        loading={modalLoading}
      />
    </div>
  );
};

export default JobTracker;
