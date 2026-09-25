import MockInterview from '../models/MockInterview.js';
import {
  generateMockQuestion,
  evaluateMockAnswer,
  generateFinalMockScorecard
} from '../services/aiService.js';

// @desc    Start new mock interview session
// @route   POST /api/mock-interview/start
// @access  Private
export const startInterview = async (req, res) => {
  try {
    const { role, company, interviewType, experienceLevel } = req.body;

    const firstQuestionText = await generateMockQuestion({
      role: role || 'Full Stack Engineer',
      company: company || 'Google',
      interviewType: interviewType || 'Coding & DSA',
      experienceLevel: experienceLevel || 'Mid-Level (3-5 yrs)',
      questionNumber: 1,
      previousQA: []
    });

    const session = await MockInterview.create({
      user: req.user._id,
      role: role || 'Full Stack Engineer',
      company: company || 'Google',
      interviewType: interviewType || 'Coding & DSA',
      experienceLevel: experienceLevel || 'Mid-Level (3-5 yrs)',
      totalQuestions: 5,
      currentQuestionIndex: 0,
      questions: [
        {
          questionNumber: 1,
          questionText: firstQuestionText,
          candidateAnswer: '',
          score: 0,
          strengths: '',
          improvements: '',
          idealAnswer: ''
        }
      ],
      status: 'In Progress'
    });

    return res.status(201).json({
      success: true,
      message: 'Mock Interview Session Initialized',
      session
    });
  } catch (error) {
    console.error('Start Interview Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize mock interview session'
    });
  }
};

// @desc    Submit answer for current question & get evaluation / next question
// @route   POST /api/mock-interview/submit-answer
// @access  Private
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, candidateAnswer } = req.body;

    if (!interviewId || !candidateAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Interview ID and candidate answer are required'
      });
    }

    const session = await MockInterview.findOne({
      _id: interviewId,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Mock interview session not found'
      });
    }

    const currentIndex = session.currentQuestionIndex;
    const currentQ = session.questions[currentIndex];

    if (!currentQ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question index'
      });
    }

    // Evaluate Candidate's Answer using AI Service
    const evalResult = await evaluateMockAnswer({
      questionText: currentQ.questionText,
      candidateAnswer,
      role: session.role,
      interviewType: session.interviewType
    });

    // Update current question in session
    session.questions[currentIndex].candidateAnswer = candidateAnswer;
    session.questions[currentIndex].score = evalResult.score;
    session.questions[currentIndex].strengths = evalResult.strengths;
    session.questions[currentIndex].improvements = evalResult.improvements;
    session.questions[currentIndex].idealAnswer = evalResult.idealAnswer;
    session.questions[currentIndex].evaluatedAt = new Date();

    // Check if there are more questions left
    if (currentIndex + 1 < session.totalQuestions) {
      const nextQuestionNum = currentIndex + 2;
      const nextQuestionText = await generateMockQuestion({
        role: session.role,
        company: session.company,
        interviewType: session.interviewType,
        experienceLevel: session.experienceLevel,
        questionNumber: nextQuestionNum,
        previousQA: session.questions
      });

      session.questions.push({
        questionNumber: nextQuestionNum,
        questionText: nextQuestionText,
        candidateAnswer: '',
        score: 0,
        strengths: '',
        improvements: '',
        idealAnswer: ''
      });

      session.currentQuestionIndex = currentIndex + 1;
      await session.save();

      return res.status(200).json({
        success: true,
        isCompleted: false,
        evaluation: evalResult,
        session
      });
    } else {
      // Final Question Reached -> Complete Session & Generate Overall Scorecard
      const scorecard = await generateFinalMockScorecard({
        questions: session.questions,
        role: session.role,
        company: session.company
      });

      session.overallScore = scorecard.overallScore;
      session.overallSummary = scorecard.overallSummary;
      session.status = 'Completed';

      await session.save();

      return res.status(200).json({
        success: true,
        isCompleted: true,
        evaluation: evalResult,
        scorecard,
        session
      });
    }
  } catch (error) {
    console.error('Submit Answer Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process answer evaluation'
    });
  }
};

// @desc    Get user past mock interview sessions
// @route   GET /api/mock-interview/history
// @access  Private
export const getInterviewHistory = async (req, res) => {
  try {
    const history = await MockInterview.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get History Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch interview history'
    });
  }
};

// @desc    Get single mock interview session by ID
// @route   GET /api/mock-interview/:id
// @access  Private
export const getInterviewById = async (req, res) => {
  try {
    const session = await MockInterview.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Mock interview session not found'
      });
    }

    return res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get Interview By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch interview session'
    });
  }
};
