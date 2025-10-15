const express = require('express');
const { body } = require('express-validator');
const jobController = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (public)
router.get('/', jobController.getJobs);

// Get single job (public)
router.get('/:id', jobController.getJobById);

// Create job (employer only)
router.post('/', authenticate, authorize('employer'), [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('location').trim().isLength({ min: 1 }).withMessage('Location is required'),
  body('type').isIn(['Full-time', 'Part-time', 'Contract', 'Remote']).withMessage('Invalid job type'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
], jobController.createJob);

// Update job (employer only)
router.put('/:id', authenticate, authorize('employer'), jobController.updateJob);

// Delete job (employer only)
router.delete('/:id', authenticate, authorize('employer'), jobController.deleteJob);

// Get employer's jobs
router.get('/employer/my-jobs', authenticate, authorize('employer'), jobController.getEmployerJobs);

module.exports = router;
