const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.applyToJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId, coverLetter } = req.body;
    const resumeUrl = req.file ? req.file.path : null;

    if (!resumeUrl) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApplication = await Application.findOne({ jobId, candidateId: req.user._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      jobId,
      candidateId: req.user._id,
      resumeUrl,
      coverLetter
    });

    await application.save();

    // Update applicants count
    job.applicantsCount += 1;
    await job.save();

    // Send confirmation email to candidate
    const candidate = await User.findById(req.user._id);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: 'Application Submitted Successfully',
      text: `Hello ${candidate.name}, your application for ${job.title} has been submitted successfully.`
    };

    transporter.sendMail(mailOptions);

    // Notify employer
    const employer = await User.findById(job.companyId);
    const employerMailOptions = {
      from: process.env.EMAIL_USER,
      to: employer.email,
      subject: 'New Application Received',
      text: `Hello ${employer.name}, you have received a new application for ${job.title}.`
    };

    transporter.sendMail(employerMailOptions);

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate('jobId', 'title companyId location type')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('candidateId', 'name email profile')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.jobId);
    if (job.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
