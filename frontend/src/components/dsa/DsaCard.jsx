import React from 'react';
import {
  ExternalLink,
  Clock,
  HardDrive,
  Edit2,
  Trash2
} from 'lucide-react';

const DsaCard = ({ problem, onEdit, onDelete, onStatusChange }) => {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Hard':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default: // Easy
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Revision Needed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'To Do':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default: // Solved
        return 'bg-[#EBE5F7] text-[#6E56AF] border-[#E5DEF4]';
    }
  };

  return (
    <div className="bg-white border border-[#E5DEF4] hover:border-[#6E56AF]/40 rounded-3xl p-5 shadow-lg shadow-[#6E56AF]/05 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Bar: Difficulty & Status Select */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F7F4FD] text-[#6B637B] border border-[#E5DEF4]">
              {problem.platform || 'LeetCode'}
            </span>
          </div>

          <select
            value={problem.status}
            onChange={(e) => onStatusChange(problem._id, e.target.value)}
            className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${getStatusBadge(
              problem.status
            )} bg-white`}
          >
            <option value="Solved" className="bg-white text-[#6E56AF]">Solved</option>
            <option value="Revision Needed" className="bg-white text-purple-700">Revision Needed</option>
            <option value="To Do" className="bg-white text-slate-700">To Do</option>
          </select>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-[#1E192B] group-hover:text-[#6E56AF] transition-colors mb-2">
          {problem.title}
        </h3>

        {/* Topic Tag */}
        <div className="mb-3">
          <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EBE5F7] text-[#6E56AF] border border-[#E5DEF4]">
            {problem.topic || 'Arrays'}
          </span>
        </div>

        {/* Complexities */}
        <div className="flex items-center gap-3 text-xs text-[#6B637B] mb-4 font-mono">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#6E56AF]" />
            <span>Time: {problem.timeComplexity || 'O(N)'}</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-[#6E56AF]" />
            <span>Space: {problem.spaceComplexity || 'O(1)'}</span>
          </div>
        </div>

        {/* Notes preview */}
        {problem.notes && (
          <div className="p-2.5 rounded-2xl bg-[#F7F4FD] border border-[#E5DEF4] text-[11px] text-[#6B637B] mb-4 line-clamp-2">
            {problem.notes}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#E5DEF4] flex items-center justify-between">
        {problem.solutionUrl ? (
          <a
            href={problem.solutionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6E56AF] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Solution Link
          </a>
        ) : (
          <span className="text-[11px] text-[#6B637B] font-medium">Problem</span>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(problem)}
            title="Edit Problem"
            className="p-1.5 text-[#6B637B] hover:text-[#6E56AF] hover:bg-[#F7F4FD] rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(problem._id)}
            title="Delete Problem"
            className="p-1.5 text-[#6B637B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DsaCard;
