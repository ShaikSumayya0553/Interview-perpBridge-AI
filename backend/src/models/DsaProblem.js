import mongoose from 'mongoose';

const dsaProblemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: [true, 'Please add a problem title'],
      trim: true
    },
    platform: {
      type: String,
      enum: ['LeetCode', 'HackerRank', 'Codeforces', 'GeeksforGeeks', 'InterviewBit', 'Other'],
      default: 'LeetCode'
    },
    topic: {
      type: String,
      enum: [
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
      ],
      default: 'Arrays'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    },
    status: {
      type: String,
      enum: ['Solved', 'Revision Needed', 'To Do'],
      default: 'Solved'
    },
    solutionUrl: {
      type: String,
      default: ''
    },
    timeComplexity: {
      type: String,
      default: 'O(N)'
    },
    spaceComplexity: {
      type: String,
      default: 'O(1)'
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

const DsaProblem = mongoose.model('DsaProblem', dsaProblemSchema);

export default DsaProblem;
