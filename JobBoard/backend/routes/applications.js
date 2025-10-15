const express = require('express');
const { body } = require('express-validator');
const applicationController = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Apply to job (candidate only)
router.post('/apply/:jobId', authenticate, authorize('candidate'), upload.single('resume'), [
  body('coverLetter').optional().isLength({ max: 1000 }).withMessage('Cover letter must be less than 1000 characters')
], applicationController.applyToJob);

// Get user's applications (candidate only)
router.get('/my-applications', authenticate, authorize('candidate'), applicationController.getUserApplications);

// Get job applicants (employer only)
router.get('/job/:jobId/applicants', authenticate, authorize('employer'), applicationController.getJobApplicants);

// Update application status (employer only)
router.put('/:id/status', authenticate, authorize('employer'), [
  body('status').isIn(['submitted', 'reviewed', 'shortlisted', 'rejected', 'accepted']).withMessage('Invalid status')
], applicationController.updateApplicationStatus);

module.exports = router;
