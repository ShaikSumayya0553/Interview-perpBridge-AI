import { chatWithAI, explainCode, generateDSAHints } from '../services/aiService.js';

// @desc    Chat with Gemini AI Technical Copilot
// @route   POST /api/ai/chat
// @access  Private
export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const reply = await chatWithAI({ message, history });

    return res.status(200).json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Controller Chat Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat request'
    });
  }
};

// @desc    Analyze code snippet & Big-O complexity
// @route   POST /api/ai/explain-code
// @access  Private
export const handleExplainCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code snippet is required'
      });
    }

    const explanation = await explainCode({ code, language });

    return res.status(200).json({
      success: true,
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Controller Explain Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze code snippet'
    });
  }
};

// @desc    Generate staged DSA problem hints
// @route   POST /api/ai/hint
// @access  Private
export const handleHint = async (req, res) => {
  try {
    const { problemTitle, topic, code } = req.body;

    if (!problemTitle) {
      return res.status(400).json({
        success: false,
        message: 'Problem title is required'
      });
    }

    const hints = await generateDSAHints({ problemTitle, topic, code });

    return res.status(200).json({
      success: true,
      hints,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI Controller Hint Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate DSA hints'
    });
  }
};
