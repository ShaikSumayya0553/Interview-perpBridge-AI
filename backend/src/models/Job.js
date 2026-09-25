import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Please add a job position/title'],
      trim: true
    },
    location: {
      type: String,
      default: 'Remote'
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time'
    },
    status: {
      type: String,
      enum: ['Applied', 'Interviewing', 'Offered', 'Rejected'],
      default: 'Applied'
    },
    salary: {
      type: String,
      default: ''
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    jobUrl: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
