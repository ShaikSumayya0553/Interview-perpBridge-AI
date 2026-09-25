import DsaProblem from '../models/DsaProblem.js';

// @desc    Get all DSA problems for logged-in user
// @route   GET /api/dsa
// @access  Private
export const getDsaProblems = async (req, res) => {
  try {
    const { search, topic, difficulty, status } = req.query;
    const query = { user: req.user._id };

    if (topic && topic !== 'All') {
      query.topic = topic;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } }
      ];
    }

    const problems = await DsaProblem.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error) {
    console.error('GetDsaProblems Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching DSA problems'
    });
  }
};

// @desc    Get DSA problem analytics and stats
// @route   GET /api/dsa/stats
// @access  Private
export const getDsaStats = async (req, res) => {
  try {
    const problems = await DsaProblem.find({ user: req.user._id });

    const total = problems.length;
    const solved = problems.filter((p) => p.status === 'Solved').length;
    const revision = problems.filter((p) => p.status === 'Revision Needed').length;
    const toDo = problems.filter((p) => p.status === 'To Do').length;

    const easySolved = problems.filter((p) => p.difficulty === 'Easy' && p.status === 'Solved').length;
    const mediumSolved = problems.filter((p) => p.difficulty === 'Medium' && p.status === 'Solved').length;
    const hardSolved = problems.filter((p) => p.difficulty === 'Hard' && p.status === 'Solved').length;

    const easyTotal = problems.filter((p) => p.difficulty === 'Easy').length;
    const mediumTotal = problems.filter((p) => p.difficulty === 'Medium').length;
    const hardTotal = problems.filter((p) => p.difficulty === 'Hard').length;

    return res.status(200).json({
      success: true,
      stats: {
        total,
        solved,
        revision,
        toDo,
        easy: { solved: easySolved, total: easyTotal },
        medium: { solved: mediumSolved, total: mediumTotal },
        hard: { solved: hardSolved, total: hardTotal }
      }
    });
  } catch (error) {
    console.error('GetDsaStats Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error calculating DSA analytics'
    });
  }
};

// @desc    Create a new DSA problem
// @route   POST /api/dsa
// @access  Private
export const createDsaProblem = async (req, res) => {
  try {
    const { title, platform, topic, difficulty, status, solutionUrl, timeComplexity, spaceComplexity, notes } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Problem title is required'
      });
    }

    const problem = await DsaProblem.create({
      user: req.user._id,
      title,
      platform: platform || 'LeetCode',
      topic: topic || 'Arrays',
      difficulty: difficulty || 'Easy',
      status: status || 'Solved',
      solutionUrl: solutionUrl || '',
      timeComplexity: timeComplexity || 'O(N)',
      spaceComplexity: spaceComplexity || 'O(1)',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'DSA Problem recorded successfully',
      problem
    });
  } catch (error) {
    console.error('CreateDsaProblem Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error recording DSA problem'
    });
  }
};

// @desc    Update a DSA problem
// @route   PUT /api/dsa/:id
// @access  Private
export const updateDsaProblem = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Invalid DSA problem ID'
      });
    }

    let problem = await DsaProblem.findOne({ _id: req.params.id, user: req.user._id });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'DSA problem entry not found'
      });
    }

    problem = await DsaProblem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'DSA problem updated successfully',
      problem
    });
  } catch (error) {
    console.error('UpdateDsaProblem Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating DSA problem'
    });
  }
};

// @desc    Delete a DSA problem
// @route   DELETE /api/dsa/:id
// @access  Private
export const deleteDsaProblem = async (req, res) => {
  try {
    const problem = await DsaProblem.findOne({ _id: req.params.id, user: req.user._id });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'DSA problem entry not found'
      });
    }

    await problem.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'DSA problem deleted successfully'
    });
  } catch (error) {
    console.error('DeleteDsaProblem Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting DSA problem'
    });
  }
};
