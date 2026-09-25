import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  ExternalLink,
  Edit2,
  Trash2,
  FileText,
  Briefcase
} from 'lucide-react';

const JobCard = ({ job, onEdit, onDelete, onStatusChange }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interviewing':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Offered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default: // Applied
        return 'bg-[#EBE5F7] text-[#6E56AF] border-[#E5DEF4]';
    }
  };

  const formattedDate = job.appliedDate
    ? new Date(job.appliedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="bg-white border border-[#E5DEF4] hover:border-[#6E56AF]/40 rounded-3xl p-5 shadow-lg shadow-[#6E56AF]/05 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Company + Status Dropdown */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#6E56AF] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md shadow-[#6E56AF]/20">
              {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-base font-extrabold text-[#1E192B] group-hover:text-[#6E56AF] transition-colors truncate">
                {job.position}
              </h3>
              <p className="text-xs font-semibold text-[#6B637B] flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-[#6E56AF] flex-shrink-0" />
                <span>{job.company}</span>
              </p>
            </div>
          </div>

          {/* Quick Status Select Pill */}
          <select
            value={job.status}
            onChange={(e) => onStatusChange(job._id, e.target.value)}
            className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${getStatusBadge(
              job.status
            )} bg-white`}
          >
            <option value="Applied" className="bg-white text-[#6E56AF]">Applied</option>
            <option value="Interviewing" className="bg-white text-purple-700">Interviewing</option>
            <option value="Offered" className="bg-white text-emerald-700">Offered</option>
            <option value="Rejected" className="bg-white text-rose-700">Rejected</option>
          </select>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs text-[#6B637B]">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#6E56AF]" />
            <span className="truncate">{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-[#6E56AF]" />
            <span className="truncate">{job.jobType || 'Full-time'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-[#6E56AF]" />
            <span className="truncate">{formattedDate}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1.5 truncate">
              <IndianRupee className="w-3.5 h-3.5 text-[#6E56AF]" />
              <span className="truncate text-[#1E192B] font-bold">
                {job.salary.startsWith('$') ? job.salary.replace('$', '₹') : job.salary}
              </span>
            </div>
          )}
        </div>

        {/* Notes preview if available */}
        {job.notes && (
          <div className="p-2.5 rounded-2xl bg-[#F7F4FD] border border-[#E5DEF4] text-[11px] text-[#6B637B] mb-4 line-clamp-2 flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-[#6E56AF] flex-shrink-0 mt-0.5" />
            <span>{job.notes}</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-[#E5DEF4] flex items-center justify-between">
        {job.jobUrl ? (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6E56AF] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Job Posting Link
          </a>
        ) : (
          <span className="text-[11px] text-[#6B637B] font-medium">Application</span>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(job)}
            title="Edit Application"
            className="p-1.5 text-[#6B637B] hover:text-[#6E56AF] hover:bg-[#F7F4FD] rounded-lg transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(job._id)}
            title="Delete Application"
            className="p-1.5 text-[#6B637B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
