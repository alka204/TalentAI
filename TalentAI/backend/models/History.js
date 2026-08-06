const mongoose = require('mongoose');

/**
 * History is a denormalized, read-optimized ledger of past interviews.
 * It is written once an interview + its result are finalized, so the
 * Interview History page can query a single lean collection instead of
 * joining Interview + InterviewResult on every request.
 */
const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    result: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewResult',
      required: true,
    },
    role: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    difficulty: { type: String, required: true },
    duration: { type: Number, required: true },
    overallScore: { type: Number, required: true },
    completedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

historySchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('History', historySchema);
