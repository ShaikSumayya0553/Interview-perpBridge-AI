import React, { useState, useEffect } from 'react';
import { X, Code2, Link, Clock, HardDrive } from 'lucide-react';

const DsaModal = ({ isOpen, onClose, onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    topic: 'Arrays',
    difficulty: 'Easy',
    status: 'Solved',
    solutionUrl: '',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    notes: ''
  });

  const topicsList = [
    'Arrays',
    'Strings',
    'LinkedList',
    'Stack/Queue',
    'Trees',
    'Graphs',
    'Dynamic Programming',
    'Binary Search',
    'Sliding Window',
    'Heap/Priority Queue',
    'Backtracking',
    'Greedy',
    'Other'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        platform: initialData.platform || 'LeetCode',
        topic: initialData.topic || 'Arrays',
        difficulty: initialData.difficulty || 'Easy',
        status: initialData.status || 'Solved',
        solutionUrl: initialData.solutionUrl || '',
        timeComplexity: initialData.timeComplexity || 'O(N)',
        spaceComplexity: initialData.spaceComplexity || 'O(1)',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        title: '',
        platform: 'LeetCode',
        topic: 'Arrays',
        difficulty: 'Easy',
        status: 'Solved',
        solutionUrl: '',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
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
          {initialData ? 'Edit DSA Problem' : 'Log New DSA Problem'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
              Problem Title *
            </label>
            <div className="relative">
              <Code2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Two Sum, 3Sum, Reverse Linked List..."
                className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF]"
              />
            </div>
          </div>

          {/* Platform & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF]"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="HackerRank">HackerRank</option>
                <option value="Codeforces">Codeforces</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
                <option value="InterviewBit">InterviewBit</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Topic Category
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF]"
              >
                {topicsList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF]"
              >
                <option value="Solved">Solved</option>
                <option value="Revision Needed">Revision Needed</option>
                <option value="To Do">To Do</option>
              </select>
            </div>
          </div>

          {/* Time & Space Complexity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Time Complexity
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
                <input
                  type="text"
                  name="timeComplexity"
                  value={formData.timeComplexity}
                  onChange={handleChange}
                  placeholder="O(N log N)"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Space Complexity
              </label>
              <div className="relative">
                <HardDrive className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
                <input
                  type="text"
                  name="spaceComplexity"
                  value={formData.spaceComplexity}
                  onChange={handleChange}
                  placeholder="O(1)"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Solution URL */}
          <div>
            <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
              Solution / Problem URL
            </label>
            <div className="relative">
              <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E56AF]" />
              <input
                type="url"
                name="solutionUrl"
                value={formData.solutionUrl}
                onChange={handleChange}
                placeholder="https://leetcode.com/problems/..."
                className="w-full pl-10 pr-3 py-2.5 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B]/60 focus:outline-none focus:border-[#6E56AF]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
              Solution Notes & Key Takeaways
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Two-pointer technique, edge cases, key optimization insight..."
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
                'Log Problem'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DsaModal;
