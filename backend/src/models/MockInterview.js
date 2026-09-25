import mongoose from 'mongoose';

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    role: {
      type: String,
      required: true,
      default: 'Full Stack Engineer'
    },
    company: {
      type: String,
      required: true,
      default: 'Google'
    },
    interviewType: {
      type: String,
      enum: ['Coding & DSA', 'System Design', 'Behavioral'],
      default: 'Coding & DSA'
    },
    experienceLevel: {
      type: String,
      default: 'Fresher / Entry Level (0-1 yrs)'
    },
    totalQuestions: {
      type: Number,
      default: 5
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    questions: [
      {
        questionNumber: Number,
        questionText: String,
        candidateAnswer: String,
        score: {
          type: Number,
          default: 0
        },
        strengths: String,
        improvements: String,
        idealAnswer: String,
        evaluatedAt: Date
      }
    ],
    overallScore: {
      type: Number,
      default: 0
    },
    overallSummary: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed'],
      default: 'In Progress'
    }
  },
  {
    timestamps: true
  }
);

const MockInterview = mongoose.model('MockInterview', mockInterviewSchema);

export default MockInterview;
