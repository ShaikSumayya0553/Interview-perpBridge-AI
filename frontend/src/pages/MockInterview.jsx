import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Mic,
  MicOff,
  Send,
  Award,
  BrainCircuit,
  Building2,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Clock,
  UserCheck,
  ChevronRight,
  Bot
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const MockInterview = () => {
  const [viewState, setViewState] = useState('setup'); // 'setup' | 'live' | 'scorecard'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup Form Configuration
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('Full Stack Engineer');
  const [interviewType, setInterviewType] = useState('Coding & DSA');
  const [experienceLevel, setExperienceLevel] = useState('Fresher / Entry Level (0-1 yrs)');

  // Active Session State
  const [session, setSession] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [showFeedbackDrawer, setShowFeedbackDrawer] = useState(false);

  // Speech Recognition (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const companiesList = ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix', 'Tech Startup'];
  const rolesList = ['Full Stack Engineer', 'Frontend Engineer', 'Backend Engineer', 'System Design Architect', 'DevOps / SRE'];
  const typesList = ['Coding & DSA', 'System Design', 'Behavioral'];
  const levelsList = ['Fresher / Entry Level (0-1 yrs)', 'Junior (1-2 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (5+ yrs)'];

  // Initialize Speech Recognition on Mount (Safely wrapped in try-catch for mobile browser support)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = false;
          rec.lang = 'en-US';

          rec.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i]?.isFinal) {
                finalTranscript += event.results[i][0].transcript;
              }
            }
            if (finalTranscript.trim()) {
              setCurrentAnswer((prev) => {
                const trimmedPrev = (prev || '').trim();
                const trimmedNew = finalTranscript.trim();
                return trimmedPrev ? `${trimmedPrev} ${trimmedNew}` : trimmedNew;
              });
            }
          };

          rec.onerror = (err) => {
            console.warn('Speech Recognition Error:', err?.error);
            setIsListening(false);
          };

          rec.onend = () => {
            setIsListening(false);
          };

          setRecognition(rec);
        }
      }
    } catch (e) {
      console.warn('Speech Recognition is restricted or unsupported on this device:', e);
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported in your browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/mock-interview/start`, {
        company,
        role,
        interviewType,
        experienceLevel
      });

      if (response.data && response.data.success) {
        setSession(response.data.session);
        setCurrentAnswer('');
        setCurrentFeedback(null);
        setShowFeedbackDrawer(false);
        setViewState('live');
      }
    } catch (err) {
      console.error('Start Interview Error:', err);
      setError('Failed to start mock interview session. Please verify backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e?.preventDefault();
    if (!currentAnswer.trim() || isEvaluating) return;

    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/mock-interview/submit-answer`, {
        interviewId: session._id,
        candidateAnswer: currentAnswer
      });

      if (response.data && response.data.success) {
        setCurrentFeedback(response.data.evaluation);
        setShowFeedbackDrawer(true);
        setSession(response.data.session);

        if (response.data.isCompleted) {
          // Final Question Completed -> Transition to Scorecard
          setTimeout(() => {
            setViewState('scorecard');
          }, 2500);
        }
      }
    } catch (err) {
      console.error('Submit Answer Error:', err);
      setError('Failed to evaluate answer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedbackDrawer(false);
    setCurrentAnswer('');
  };

  const currentQIndex = session ? session.currentQuestionIndex : 0;
  const currentQ = session && session.questions ? session.questions[currentQIndex] : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBE5F7] text-[#6E56AF] text-xs font-bold uppercase tracking-wider mb-2">
            <Mic className="w-3.5 h-3.5 text-[#6E56AF]" /> Live Interview Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E192B] tracking-tight">
            Interactive AI Mock Interview Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#6B637B] mt-1">
            Simulated technical & behavioral interviews with instant AI feedback per question and executive scorecards.
          </p>
        </div>

        {viewState !== 'setup' && (
          <button
            onClick={() => setViewState('setup')}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F7F4FD] border border-[#E5DEF4] text-[#6B637B] font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Start New Session
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* VIEW STATE 1: SETUP SCREEN */}
      {viewState === 'setup' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 max-w-3xl mx-auto space-y-6">
          <div className="space-y-1 text-center sm:text-left border-b border-[#E5DEF4] pb-5">
            <h2 className="text-xl font-black text-[#1E192B] flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#6E56AF]" /> Configure Your Technical Interview Session
            </h2>
            <p className="text-xs text-[#6B637B]">
              Select target company, role, and interview mode to tailor the AI interviewer questions to your goal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Target Company */}
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#6E56AF]" /> Target Company
              </label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] font-bold focus:outline-none focus:border-[#6E56AF]"
              >
                {companiesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Role */}
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#6E56AF]" /> Target Position
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] font-bold focus:outline-none focus:border-[#6E56AF]"
              >
                {rolesList.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6E56AF]" /> Interview Type
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] font-bold focus:outline-none focus:border-[#6E56AF]"
              >
                {typesList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block font-bold text-[#6B637B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#6E56AF]" /> Candidate Seniority
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-3 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] font-bold focus:outline-none focus:border-[#6E56AF]"
              >
                {levelsList.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5DEF4]">
            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#6E56AF] hover:bg-[#5C469C] text-white font-black text-xs shadow-xl shadow-[#6E56AF]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Start AI Mock Interview Session <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW STATE 2: LIVE INTERVIEW SESSION */}
      {viewState === 'live' && session && (
        <div className="space-y-6">
          {/* Interviewer & Stepper Header Banner */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#6E56AF] text-white flex items-center justify-center font-bold text-base shadow-md relative">
                <Mic className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white animate-ping"></span>
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1E192B] flex items-center gap-2">
                  {session.company} AI Technical Interviewer
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBE5F7] text-[#6E56AF] font-bold border border-[#E5DEF4]">
                    {session.interviewType}
                  </span>
                </h3>
                <p className="text-xs text-[#6B637B]">
                  Role: <strong className="text-[#1E192B]">{session.role}</strong> ({session.experienceLevel})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#6B637B] uppercase tracking-wider block">PROGRESS</span>
                <span className="text-sm font-black text-[#1E192B]">
                  Question {currentQIndex + 1} of {session.totalQuestions}
                </span>
              </div>

              {/* Progress Ring / Stepper */}
              <div className="flex items-center gap-1">
                {Array.from({ length: session.totalQuestions }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentQIndex
                        ? 'bg-[#6E56AF] scale-125 ring-2 ring-[#6E56AF]/30'
                        : idx < currentQIndex
                        ? 'bg-emerald-500'
                        : 'bg-[#E5DEF4]'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE5F7] text-[#6E56AF] text-[11px] font-extrabold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5 text-[#6E56AF]" /> Interview Question #{currentQIndex + 1}
            </div>

            <h2 className="text-base sm:text-lg font-black text-[#1E192B] leading-relaxed">
              {currentQ?.questionText || 'Loading question...'}
            </h2>
          </div>

          {/* Candidate Response Section */}
          <div className="p-4 sm:p-8 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <label className="block font-extrabold text-[#1E192B] text-xs uppercase tracking-wider">
                Your Answer / Code Explanation
              </label>

              {/* Voice Mic Toggle */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto ${
                  isListening
                    ? 'bg-rose-500 text-white shadow-lg animate-pulse'
                    : 'bg-[#F7F4FD] text-[#6E56AF] hover:bg-[#EBE5F7] border border-[#E5DEF4]'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Recording Voice... (Click to stop)
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Voice Input (Speech-to-Text)
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <textarea
                rows="6"
                required
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={
                  session?.interviewType === 'Behavioral'
                    ? 'Type or speak your answer here... Use the STAR method (Situation, Task, Action, Result), outline your tech stack, and highlight your specific contributions & project impact.'
                    : session?.interviewType === 'System Design'
                    ? 'Type or speak your answer here... Detail high-level architecture, API endpoints, database selection, caching strategies, and scalability trade-offs.'
                    : 'Type or speak your answer here... Walk through your approach, data structure choices, Big-O complexity, and boundary edge cases.'
                }
                className="w-full p-4 bg-[#F7F4FD] border border-[#E5DEF4] rounded-2xl text-xs text-[#1E192B] placeholder-[#6B637B] focus:outline-none focus:border-[#6E56AF] resize-none leading-relaxed"
              ></textarea>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-[#6B637B] font-mono">
                  Word Count: {currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} words
                </span>

                <button
                  type="submit"
                  disabled={isEvaluating || !currentAnswer.trim()}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#6E56AF] hover:bg-[#5C469C] text-white font-bold text-xs shadow-lg shadow-[#6E56AF]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isEvaluating ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit & Evaluate Answer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* INSTANT PER-QUESTION AI EVALUATION DRAWER */}
          {showFeedbackDrawer && currentFeedback && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DEF4] shadow-2xl shadow-[#6E56AF]/10 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DEF4] pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg ${
                      currentFeedback.score >= 8
                        ? 'bg-emerald-500'
                        : currentFeedback.score >= 6
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  >
                    {currentFeedback.score}/10
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1E192B]">Question Evaluation Score</h3>
                    <p className="text-xs text-[#6B637B]">
                      {currentFeedback.score >= 8
                        ? 'Excellent technical breakdown and clarity!'
                        : 'Solid response with areas for refinement.'}
                    </p>
                  </div>
                </div>

                {currentQIndex + 1 < session.totalQuestions ? (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-full bg-[#6E56AF] text-white font-bold text-xs shadow-md hover:bg-[#5C469C] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setViewState('scorecard')}
                    className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    View Executive Scorecard <Award className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                  <span className="font-extrabold text-emerald-700 uppercase tracking-wider block">Key Strengths</span>
                  <p className="leading-relaxed">{currentFeedback.strengths}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-extrabold text-amber-700 uppercase tracking-wider block">Areas for Improvement</span>
                  <p className="leading-relaxed">{currentFeedback.improvements}</p>
                </div>
              </div>

              {currentFeedback.idealAnswer && (
                <div className="p-4 rounded-2xl bg-[#F7F4FD] border border-[#E5DEF4] text-xs space-y-1">
                  <span className="font-extrabold text-[#6E56AF] uppercase tracking-wider block">Ideal Answer Blueprint</span>
                  <p className="text-[#1E192B] leading-relaxed">
                    {currentFeedback.idealAnswer
                      .replace(/^an ideal response would follow the star framework and sound like this:?\s*/gi, '')
                      .replace(/^an ideal response would (sound like this|highlight|cover|be):?\s*/gi, '')
                      .replace(/^an ideal answer would (be|sound like this):?\s*/gi, '')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW STATE 3: EXECUTIVE PERFORMANCE SCORECARD */}
      {viewState === 'scorecard' && session && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Executive Verdict Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6E56AF] via-[#7C66B9] to-[#6E56AF] p-6 sm:p-8 text-white shadow-xl shadow-[#6E56AF]/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4 text-white" /> EXECUTIVE CANDIDATE SCORECARD
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {session.company} - {session.role}
                </h2>
                <p className="text-xs text-white/80 max-w-lg leading-relaxed">
                  {session.overallSummary || 'Mock Technical Interview Session Completed.'}
                </p>
              </div>

              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white flex flex-col items-center justify-center flex-shrink-0 shadow-inner">
                <span className="text-3xl font-black text-white">{session.overallScore}%</span>
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">READINESS</span>
              </div>
            </div>
          </div>

          {/* Questions & Feedback Breakdown Accordion */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5DEF4] shadow-xl shadow-[#6E56AF]/05 space-y-4">
            <h3 className="text-sm font-black text-[#1E192B] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6E56AF]" /> Interview Question & Feedback Breakdown
            </h3>

            <div className="space-y-4">
              {session?.questions && Array.isArray(session.questions) && session.questions.map((q, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#F7F4FD] border border-[#E5DEF4] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-[#1E192B]">
                      Question #{q.questionNumber}: {q.questionText}
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        q.score >= 8
                          ? 'bg-emerald-100 text-emerald-700'
                          : q.score >= 6
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {q.score}/10
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#E5DEF4] text-xs text-[#6B637B]">
                    <strong className="text-[#1E192B] font-bold block mb-1">Your Answer:</strong>
                    <p className="italic">{q.candidateAnswer || 'No answer submitted.'}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                      <strong>Strengths:</strong> {q.strengths}
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800">
                      <strong>Improvements:</strong> {q.improvements}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setViewState('setup')}
              className="px-8 py-3.5 rounded-full bg-[#6E56AF] hover:bg-[#5C469C] text-white font-bold text-xs shadow-lg shadow-[#6E56AF]/25 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Practice Another Mock Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
