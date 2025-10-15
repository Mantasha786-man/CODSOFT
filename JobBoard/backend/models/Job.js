const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
    required: true
  },
  salaryMin: {
    type: Number,
    min: 0
  },
  salaryMax: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: [String],
  requirements: [String],
  benefits: [String],
  postedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  applicantsCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Job', jobSchema);
