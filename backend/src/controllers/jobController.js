import Job from '../models/Job.js';

// @desc    Get all jobs for logged-in user
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('GetJobs Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching job applications'
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    return res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('GetJobById Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching job application details'
    });
  }
};

// @desc    Create a new job application
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res) => {
  try {
    const { company, position, location, jobType, status, salary, appliedDate, jobUrl, notes } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        success: false,
        message: 'Company and Position fields are required'
      });
    }

    const job = await Job.create({
      user: req.user._id,
      company,
      position,
      location: location || 'Remote',
      jobType: jobType || 'Full-time',
      status: status || 'Applied',
      salary: salary || '',
      appliedDate: appliedDate || Date.now(),
      jobUrl: jobUrl || '',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Job application tracked successfully',
      job
    });
  } catch (error) {
    console.error('CreateJob Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating job application'
    });
  }
};

// @desc    Update a job application
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Job application updated successfully',
      job
    });
  } catch (error) {
    console.error('UpdateJob Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating job application'
    });
  }
};

// @desc    Delete a job application
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Job application deleted successfully'
    });
  } catch (error) {
    console.error('DeleteJob Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting job application'
    });
  }
};
