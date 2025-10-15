const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['candidate', 'employer'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    phone: String,
    city: String,
    state: String,
    skills: [String],
    resumeUrl: String,
    bio: String
  },
  company: {
    name: String,
    logoUrl: String,
    website: String,
    description: String,
    address: String
  }
});

module.exports = mongoose.model('User', userSchema);
