import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Code2,
  Plus,
  Search,
  AlertCircle,
  Award,
  ExternalLink,
  BrainCircuit,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import DsaCard from '../components/dsa/DsaCard';
import DsaModal from '../components/dsa/DsaModal';
import { API_BASE_URL } from '../config/api';

const DEFAULT_LEETCODE_QUESTIONS = {
  Arrays: [
    { title: 'Two Sum', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/two-sum/' },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { title: 'Contains Duplicate', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/contains-duplicate/' },
    { title: 'Product of Array Except Self', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
    { title: 'Maximum Subarray', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/maximum-subarray/' },
    { title: '3Sum', difficulty: 'Medium', timeComplexity: 'O(N^2)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/3sum/' }
  ],
  Strings: [
    { title: 'Valid Anagram', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/valid-anagram/' },
    { title: 'Valid Palindrome', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/valid-palindrome/' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', timeComplexity: 'O(N^2)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    { title: 'Group Anagrams', difficulty: 'Medium', timeComplexity: 'O(N*K log K)', spaceComplexity: 'O(N*K)', url: 'https://leetcode.com/problems/group-anagrams/' }
  ],
  LinkedList: [
    { title: 'Reverse Linked List', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/reverse-linked-list/' },
    { title: 'Merge Two Sorted Lists', difficulty: 'Easy', timeComplexity: 'O(N + M)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { title: 'Linked List Cycle', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/linked-list-cycle/' },
    { title: 'Reorder List', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/reorder-list/' },
    { title: 'Remove Nth Node From End of List', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' }
  ],
  'Stack/Queue': [
    { title: 'Valid Parentheses', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/valid-parentheses/' },
    { title: 'Min Stack', difficulty: 'Medium', timeComplexity: 'O(1)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/min-stack/' },
    { title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
    { title: 'Daily Temperatures', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/daily-temperatures/' }
  ],
  Trees: [
    { title: 'Invert Binary Tree', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', url: 'https://leetcode.com/problems/invert-binary-tree/' },
    { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { title: 'Same Tree', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', url: 'https://leetcode.com/problems/same-tree/' },
    { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { title: 'Validate Binary Search Tree', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(H)', url: 'https://leetcode.com/problems/validate-binary-search-tree/' }
  ],
  Graphs: [
    { title: 'Number of Islands', difficulty: 'Medium', timeComplexity: 'O(M * N)', spaceComplexity: 'O(M * N)', url: 'https://leetcode.com/problems/number-of-islands/' },
    { title: 'Clone Graph', difficulty: 'Medium', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', url: 'https://leetcode.com/problems/clone-graph/' },
    { title: 'Course Schedule', difficulty: 'Medium', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V + E)', url: 'https://leetcode.com/problems/course-schedule/' },
    { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', timeComplexity: 'O(M * N)', spaceComplexity: 'O(M * N)', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' }
  ],
  'Dynamic Programming': [
    { title: 'Climbing Stairs', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/climbing-stairs/' },
    { title: 'House Robber', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/house-robber/' },
    { title: 'Coin Change', difficulty: 'Medium', timeComplexity: 'O(N * amount)', spaceComplexity: 'O(amount)', url: 'https://leetcode.com/problems/coin-change/' },
    { title: 'Longest Increasing Subsequence', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    { title: 'Word Break', difficulty: 'Medium', timeComplexity: 'O(N^3)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/word-break/' }
  ],
  'Binary Search': [
    { title: 'Binary Search', difficulty: 'Easy', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/binary-search/' },
    { title: 'Search a 2D Matrix', difficulty: 'Medium', timeComplexity: 'O(log(M * N))', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
    { title: 'Koko Eating Bananas', difficulty: 'Medium', timeComplexity: 'O(N log M)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
    { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' }
  ],
  'Sliding Window': [
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { title: 'Longest Repeating Character Replacement', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
    { title: 'Minimum Window Substring', difficulty: 'Hard', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/minimum-window-substring/' }
  ],
  'Heap/Priority Queue': [
    { title: 'Kth Largest Element in a Stream', difficulty: 'Easy', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
    { title: 'Last Stone Weight', difficulty: 'Easy', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/last-stone-weight/' },
    { title: 'K Closest Points to Origin', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
    { title: 'Task Scheduler', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/task-scheduler/' }
  ],
  Backtracking: [
    { title: 'Subsets', difficulty: 'Medium', timeComplexity: 'O(2^N)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/subsets/' },
    { title: 'Combination Sum', difficulty: 'Medium', timeComplexity: 'O(2^T)', spaceComplexity: 'O(T)', url: 'https://leetcode.com/problems/combination-sum/' },
    { title: 'Permutations', difficulty: 'Medium', timeComplexity: 'O(N!)', spaceComplexity: 'O(N)', url: 'https://leetcode.com/problems/permutations/' },
    { title: 'Word Search', difficulty: 'Medium', timeComplexity: 'O(N * 3^L)', spaceComplexity: 'O(L)', url: 'https://leetcode.com/problems/word-search/' }
  ],
  Greedy: [
    { title: 'Maximum Subarray', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/maximum-subarray/' },
    { title: 'Jump Game', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/jump-game/' },
    { title: 'Gas Station', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', url: 'https://leetcode.com/problems/gas-station/' }
  ]
};

const DsaTracker = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    revision: 0,
    toDo: 0,
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);

  const topicsList = [
    'All',
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
    'Greedy'
  ];

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dsa/stats`);
      if (response.data && response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching DSA stats:', err);
    }
  };

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/dsa`, {
        params: {
          search: search || undefined,
          topic: selectedTopic !== 'All' ? selectedTopic : undefined,
          difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined
        }
      });
      if (response.data && response.data.success) {
        setProblems(response.data.problems);
      }
    } catch (err) {
      console.error('Error fetching DSA problems:', err);
      setError('Failed to load DSA problems. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchProblems();
  }, [selectedTopic, selectedDifficulty, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProblems();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateOrUpdate = async (formData) => {
    setModalLoading(true);
    try {
      if (editingProblem && editingProblem._id) {
        const response = await axios.put(`${API_BASE_URL}/dsa/${editingProblem._id}`, formData);
        if (response.data && response.data.success) {
          setProblems(problems.map((p) => (p._id === editingProblem._id ? response.data.problem : p)));
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/dsa`, formData);
        if (response.data && response.data.success) {
          setProblems([response.data.problem, ...problems]);
        }
      }
      setIsModalOpen(false);
      setEditingProblem(null);
      fetchStats();
    } catch (err) {
      console.error('Error saving DSA problem:', err);
      alert(err.response?.data?.message || 'Failed to save DSA problem.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusChange = async (problemId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/dsa/${problemId}`, { status: newStatus });
      if (response.data && response.data.success) {
        setProblems(problems.map((p) => (p._id === problemId ? response.data.problem : p)));
        fetchStats();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this DSA problem entry?')) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/dsa/${problemId}`);
      if (response.data && response.data.success) {
        setProblems(problems.filter((p) => p._id !== problemId));
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting DSA problem:', err);
    }
  };

  const totalSolved = stats.solved || 1;
  const easyPercent = Math.round((stats.easy.solved / totalSolved) * 100) || 0;
  const mediumPercent = Math.round((stats.medium.solved / totalSolved) * 100) || 0;
  const hardPercent = Math.round((stats.hard.solved / totalSolved) * 100) || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBE5F7] text-[#6E56AF] text-xs font-bold uppercase tracking-wider mb-2">
            <Code2 className="w-3.5 h-3.5 text-[#6E56AF]" /> DSA Practice Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E192B] tracking-tight">
            DSA Problem & Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#6B637B] mt-1">
            Master Data Structures & Algorithms with difficulty analytics, topic categorization, and Big-O complexities.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProblem(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 rounded-full bg-[#6E56AF] hover:bg-[#5C469C] text-white font-bold text-xs shadow-lg shadow-[#6E56AF]/25 transition-all flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add DSA Problem
        </button>
      </div>

      {/* Analytics Summary Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EBE5F7] text-[#6E56AF] flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1E192B]">{stats.solved} / {stats.total} Solved</h3>
              <p className="text-xs text-[#6B637B]">Total DSA Interview Problems Completed</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold">
            <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Easy: {stats.easy.solved}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              Medium: {stats.medium.solved}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
              Hard: {stats.hard.solved}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#6B637B] mb-1.5 font-bold">
            <span>DIFFICULTY ANALYTICS BREAKDOWN</span>
            <span>{stats.solved} Problems Solved</span>
          </div>
          <div className="h-3 w-full bg-[#F7F4FD] rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-[#E5DEF4]">
            <div
              style={{ width: `${easyPercent}%` }}
              className="h-full bg-emerald-500 rounded-l-full transition-all"
              title={`Easy: ${stats.easy.solved}`}
            ></div>
            <div
              style={{ width: `${mediumPercent}%` }}
              className="h-full bg-amber-500 transition-all"
              title={`Medium: ${stats.medium.solved}`}
            ></div>
            <div
              style={{ width: `${hardPercent}%` }}
              className="h-full bg-rose-500 rounded-r-full transition-all"
              title={`Hard: ${stats.hard.solved}`}
            ></div>
          </div>
        </div>
      </div>

      {/* Topic Chips Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#6B637B]">
          <span>FILTER BY TOPIC</span>
          <span className="text-[#6E56AF] font-extrabold">{selectedTopic}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {topicsList.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedTopic === topic
                ? 'bg-[#6E56AF] text-white shadow-md'
                : 'bg-white border border-[#E5DEF4] text-[#6B637B] hover:text-[#1E192B] hover:bg-[#F7F4FD]'
                }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Curated LeetCode Practice Questions Section */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EBE5F7] text-[#6E56AF] flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-[#6E56AF]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1E192B] flex items-center gap-2">
                LeetCode Practice Questions
                {selectedTopic !== 'All' && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBE5F7] text-[#6E56AF] font-bold border border-[#E5DEF4]">
                    {selectedTopic}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[#6B637B]">
                Click any default question to open directly on LeetCode or log it to your personal progress tracker.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#6E56AF] bg-[#F7F4FD] px-3 py-1 rounded-full border border-[#E5DEF4] self-start sm:self-auto">
            {
              (selectedTopic === 'All'
                ? Object.entries(DEFAULT_LEETCODE_QUESTIONS).flatMap(([topic, list]) => list.slice(0, 1).map((q) => ({ ...q, topic })))
                : (DEFAULT_LEETCODE_QUESTIONS[selectedTopic] || []).map((q) => ({ ...q, topic: selectedTopic }))
              ).filter((q) => (selectedDifficulty === 'All' ? true : q.difficulty === selectedDifficulty)).length
            }{' '}
            Standard LeetCode Problems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(selectedTopic === 'All'
            ? Object.entries(DEFAULT_LEETCODE_QUESTIONS).flatMap(([topic, list]) => list.slice(0, 1).map((q) => ({ ...q, topic })))
            : (DEFAULT_LEETCODE_QUESTIONS[selectedTopic] || []).map((q) => ({ ...q, topic: selectedTopic }))
          )
            .filter((q) => (selectedDifficulty === 'All' ? true : q.difficulty === selectedDifficulty))
            .map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#F7F4FD] border border-[#E5DEF4] hover:border-[#6E56AF]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${q.difficulty === 'Easy'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : q.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-rose-100 text-rose-700 border-rose-200'
                        }`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[#6B637B] bg-white px-2 py-0.5 rounded border border-[#E5DEF4]">
                      {q.topic}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-[#1E192B] group-hover:text-[#6E56AF] transition-colors leading-snug">
                    {q.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-[#6B637B]">
                    <span>Time: {q.timeComplexity}</span>
                    <span>•</span>
                    <span>Space: {q.spaceComplexity}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E5DEF4] flex items-center justify-between gap-2">
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#6E56AF] hover:underline"
                  >
                    Solve on LeetCode <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      setEditingProblem({
                        title: q.title,
                        platform: 'LeetCode',
                        topic: q.topic,
                        difficulty: q.difficulty,
                        status: 'Solved',
                        solutionUrl: q.url,
                        timeComplexity: q.timeComplexity,
                        spaceComplexity: q.spaceComplexity,
                        notes: `Practiced ${q.title} from LeetCode standard topic set.`
                      });
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-[#6E56AF] hover:text-white border border-[#E5DEF4] text-[#6E56AF] font-bold text-[10px] transition-colors shadow-xs"
                  >
                    + Add Problem
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-[#E5DEF4] shadow-lg shadow-[#6E56AF]/05">
        {/* Difficulty Tabs */}
        <div className="flex items-center gap-2">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedDifficulty === diff
                ? 'bg-[#EBE5F7] text-[#6E56AF] border border-[#E5DEF4] shadow-sm'
                : 'text-[#6B637B] hover:text-[#1E192B]'
                }`}
            >
              {diff}
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
            placeholder="Search problem title or topic..."
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

      {/* DSA Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#6B637B]">
          <div className="w-8 h-8 border-4 border-[#6E56AF]/30 border-t-[#6E56AF] rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-bold">Loading DSA problems...</p>
        </div>
      ) : problems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem) => (
            <DsaCard
              key={problem._id}
              problem={problem}
              onEdit={(p) => {
                setEditingProblem(p);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 rounded-3xl bg-white border border-[#E5DEF4] text-center space-y-4 shadow-xl shadow-[#6E56AF]/05">
          <div className="w-12 h-12 rounded-2xl bg-[#EBE5F7] text-[#6E56AF] mx-auto flex items-center justify-center shadow-md">
            <Code2 className="w-6 h-6 text-[#6E56AF]" />
          </div>
          <h3 className="text-lg font-bold text-[#1E192B]">No DSA Problems Found</h3>
          <p className="text-xs text-[#6B637B] max-w-sm mx-auto">
            {search || selectedTopic !== 'All' || selectedDifficulty !== 'All'
              ? 'No problems match your current topic, difficulty, or search filters.'
              : 'You have not logged any DSA problems yet. Click below to add your first coding problem!'}
          </p>
          <button
            onClick={() => {
              setEditingProblem(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-2.5 rounded-full bg-[#6E56AF] text-white font-bold text-xs shadow-lg hover:opacity-95 transition-opacity inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add DSA Problem
          </button>
        </div>
      )}

      {/* Modal Form */}
      <DsaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingProblem}
        loading={modalLoading}
      />
    </div>
  );
};

export default DsaTracker;
