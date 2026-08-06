const mongoose = require('mongoose');

const questionAnalysisSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    score: { type: Number, min: 0, max: 100, default: 0 },
    feedback: { type: String, default: '' },
  },
  { _id: false }
);

const interviewResultSchema = new mongoose.Schema(
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
      unique: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    metrics: {
      confidence: { type: Number, min: 0, max: 100, default: 0 },
      communication: { type: Number, min: 0, max: 100, default: 0 },
      grammar: { type: Number, min: 0, max: 100, default: 0 },
      technicalKnowledge: { type: Number, min: 0, max: 100, default: 0 },
      fluency: { type: Number, min: 0, max: 100, default: 0 },
      keywordMatch: { type: Number, min: 0, max: 100, default: 0 },
      voicePace: { type: Number, min: 0, max: 100, default: 0 },
    },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    mistakes: { type: [String], default: [] },
    recommendedLearning: { type: [String], default: [] },
    questionAnalysis: { type: [questionAnalysisSchema], default: [] },
    reportUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewResult', interviewResultSchema);
