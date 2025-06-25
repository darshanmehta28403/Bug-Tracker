const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bug',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
}, {
  timestamps: true
});

// Add index for better query performance
commentSchema.index({ bug: 1, createdAt: -1 });
commentSchema.index({ project: 1, createdAt: -1 }); // Add index for project queries

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment; 