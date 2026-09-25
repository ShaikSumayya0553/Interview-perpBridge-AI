import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Bot,
  Send,
  BrainCircuit,
  Code2,
  Lightbulb,
  MessageSquare,
  Copy,
  Check,
  Zap,
  Terminal,
  RefreshCw,
  Cpu,
  User
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const AiAssistant = () => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'explainer' | 'hints'
  const [inputMessage, setInputMessage] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [problemTitle, setProblemTitle] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatEndRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Executive AI Technical Interview Copilot online. Ask any algorithm, system design, or computer science concept question.',
      timestamp: 'Just now'
    }
  ]);

  const [explanationResult, setExplanationResult] = useState('');
  const [hintResult, setHintResult] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [chatMessages, loading, activeTab]);

  const handleSendChat = async (messageToSend) => {
    const text = messageToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!messageToSend) setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, { message: text });
      if (response.data && response.data.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: response.data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error('AI Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ Failed to connect to AI server. Please make sure the backend is running.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainCode = async (e) => {
    e.preventDefault();
    if (!codeSnippet.trim() || loading) return;
    setLoading(true);
    setExplanationResult('');

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/explain-code`, {
        code: codeSnippet,
        language: codeLanguage
      });
      if (response.data && response.data.success) {
        setExplanationResult(response.data.explanation);
      }
    } catch (err) {
      console.error('Code explanation error:', err);
      setExplanationResult('⚠️ Error analyzing code. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHint = async (e) => {
    e.preventDefault();
    if (!problemTitle.trim() || loading) return;
    setLoading(true);
    setHintResult('');

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/hint`, {
        problemTitle,
        code: codeSnippet
      });
      if (response.data && response.data.success) {
        setHintResult(response.data.hints);
      }
    } catch (err) {
      console.error('DSA hint error:', err);
      setHintResult('⚠️ Error generating hints. Please check backend API service.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBE5F7] text-[#6E56AF] text-xs font-bold uppercase tracking-wider mb-2">
            <BrainCircuit className="w-3.5 h-3.5 text-[#6E56AF]" /> AI Interview Copilot
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E192B] tracking-tight">
            AI Prep Copilot Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#6B637B] mt-1">
            Master Technical Interviews with real-time AI guidance, code complexity analysis, and staged DSA hints.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#E5DEF4] shadow-sm">
          <Cpu className="w-4 h-4 text-[#6E56AF] animate-pulse" />
          <span className="text-xs font-extrabold text-[#1E192B]">Engine: AI Copilot Engine</span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E5DEF4] shadow-md shadow-[#6E56AF]/05 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-[#6E56AF] text-white shadow-md'
              : 'text-[#6B637B] hover:text-[#1E192B] hover:bg-[#F7F4FD]'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Prep Copilot Chat
        </button>

        <button
          onClick={() => setActiveTab('explainer')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'explainer'
              ? 'bg-[#6E56AF] text-white shadow-md'
              : 'text-[#6B637B] hover:text-[#1E192B] hover:bg-[#F7F4FD]'
          }`}
        >
          <Code2 className="w-4 h-4" /> Code Explainer & Big-O
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'hints'
              ? 'bg-[#6E56AF] text-white shadow-md'
              : 'text-[#6B637B] hover:text-[#1E192B] hover:bg-[#F7F4FD]'
          }`}
        >
          <Lightbulb className="w-4 h-4" /> Staged DSA Hints
        </button>
      </div>

      {/* TAB 1: PREP COPILOT CHAT */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Chat Container */}
          <div className="bg-white border border-[#E5DEF4] rounded-3xl shadow-xl shadow-[#6E56AF]/05 flex flex-col h-[520px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#E5DEF4] bg-[#F7F4FD] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#6E56AF] text-white flex items-center justify-center font-bold shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#1E192B]">Technical Interview Assistant</h3>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Online & Ready
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setChatMessages([
                    {
                      sender: 'ai',
                      text: 'Chat history cleared. How can I assist with your preparation?',
                      timestamp: 'Just now'
                    }
                  ])
                }
                className="text-xs text-[#6B637B] hover:text-[#1E192B] flex items-center gap-1 font-bold px-3 py-1.5 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-[#E5DEF4]"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear History
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#FAF9FD]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm mt-0.5 ${
                      msg.sender === 'user'
                        ? 'bg-[#6E56AF] text-white'
                        : 'bg-[#6E56AF] text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`w-fit max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm relative group ${
                      msg.sender === 'user'
                        ? 'bg-[#6E56AF] text-white rounded-tr-none'
                        : 'bg-white border border-[#E5DEF4] text-[#1E192B] rounded-tl-none'
                    }`}
                  >
                    {/* Render Formatted Response Text */}
                    <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                      {msg.text}
                    </div>

                    <div
                      className={`mt-1.5 pt-1.5 flex items-center justify-between text-[10px] font-mono ${
                        msg.sender === 'user'
                          ? 'border-t border-white/15 text-purple-200'
                          : 'border-t border-[#E5DEF4] text-[#6B637B]/80'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => copyToClipboard(msg.text, idx)}
                          className="hover:text-[#6E56AF] flex items-center gap-1 transition-colors ml-3"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-[#6E56AF] text-white flex items-center justify-center font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-[#E5DEF4] p-4 rounded-3xl text-xs text-[#6B637B] flex items-center gap-2 font-bold shadow-sm">
                    <div className="w-4 h-4 border-2 border-[#6E56AF]/30 border-t-[#6E56AF] rounded-full animate-spin"></div>
                    Loading...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-white border-t border-[#E5DEF4]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask any coding, algorithm, or system design question..."
                  className="flex-1 px-4 py-3 bg-[#F7F4FD] border border-[#E5DEF4] rounded-full text-xs text-[#1E192B] placeholder-[#6B637B] focus:outline-none focus:border-[#6E56AF]"
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="w-10 h-10 rounded-full bg-[#6E56AF] hover:bg-[#5C469C] text-white flex items-center justify-center transition-opacity disabled:opacity-50 flex-shrink-0 shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CODE EXPLAINER & BIG-O */}
      {activeTab === 'explainer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Code Snippet */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#1E192B] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#6E56AF]" /> Paste Code Snippet
              </h3>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="px-3 py-1 bg-[#F7F4FD] border border-[#E5DEF4] rounded-xl text-xs font-bold text-[#6E56AF]"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <textarea
              rows="12"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="// Paste your algorithm function code snippet here...
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}"
              className="w-full p-4 bg-[#1E192B] text-emerald-400 font-mono text-xs rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6E56AF] resize-none leading-relaxed"
            ></textarea>

            <button
              onClick={handleExplainCode}
              disabled={loading || !codeSnippet.trim()}
              className="w-full py-3 rounded-full bg-[#6E56AF] hover:bg-[#5C469C] text-white font-bold text-xs shadow-lg shadow-[#6E56AF]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Analyze Big-O Complexity
                </>
              )}
            </button>
          </div>

          {/* Explanation Output */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-[#1E192B] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#6E56AF]" /> Complexity Analysis Output
              </h3>

              {explanationResult ? (
                <div className="p-4 rounded-2xl bg-[#F7F4FD] border border-[#E5DEF4] text-xs text-[#1E192B] whitespace-pre-wrap font-sans leading-relaxed">
                  {explanationResult}
                </div>
              ) : (
                <div className="py-20 text-center text-[#6B637B] space-y-2">
                  <Code2 className="w-10 h-10 text-[#6E56AF] mx-auto opacity-50" />
                  <p className="text-xs font-bold">Paste a code snippet on the left and click Analyze.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STAGED DSA HINTS */}
      {activeTab === 'hints' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-base font-black text-[#1E192B] flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#6E56AF]" /> Progressive DSA Hint Generator
            </h3>
            <p className="text-xs text-[#6B637B]">
              Stuck on a LeetCode problem? Get step-by-step progressive hints without spoiling the final answer.
            </p>
          </div>

          <form onSubmit={handleGenerateHint} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Problem Title or Description *
              </label>
              <input
                type="text"
                required
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="e.g. Trapping Rain Water, Course Schedule, Longest Palindromic Substring"
                className="w-full px-4 py-3 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-1.5">
                Your Attempted Code / Draft (Optional)
              </label>
              <textarea
                rows="4"
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Optional: Paste what you have tried so far..."
                className="w-full p-3 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] focus:outline-none focus:border-[#6E56AF] resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading || !problemTitle.trim()}
              className="w-full py-3 rounded-full bg-[#6E56AF] hover:bg-[#5C469C] text-white font-bold text-xs shadow-lg shadow-[#6E56AF]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4" /> Generate Staged Hints
                </>
              )}
            </button>
          </form>

          {hintResult && (
            <div className="pt-4 border-t border-[#E5DEF4] space-y-3">
              <h4 className="text-xs font-extrabold text-[#1E192B] uppercase tracking-wider">
                Generated Staged Hints
              </h4>
              <div className="p-4 rounded-2xl bg-[#F7F4FD] border border-[#E5DEF4] text-xs text-[#1E192B] whitespace-pre-wrap font-sans leading-relaxed">
                {hintResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
