const asyncHandler = require('express-async-handler');
const Interview = require('../models/Interview');
const InterviewResult = require('../models/InterviewResult');
const History = require('../models/History');
const { evaluateInterview } = require('../services/geminiService');
const { streamInterviewReport } = require('../services/pdfReportService');

// @desc    Finalize an interview: run Gemini evaluation and store the result
// @route   POST /api/interviews/:id/finish
// @access  Private
const finishInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  const evaluation = await evaluateInterview({
    role: interview.role,
    questions: interview.questions,
  });

  const result = await InterviewResult.create({
    user: req.user._id,
    interview: interview._id,
    ...evaluation,
  });

  interview.status = 'completed';
  interview.completedAt = new Date();
  await interview.save();

  await History.create({
    user: req.user._id,
    interview: interview._id,
    result: result._id,
    role: interview.role,
    experienceLevel: interview.experienceLevel,
    difficulty: interview.difficulty,
    duration: interview.duration,
    overallScore: result.overallScore,
    completedAt: interview.completedAt,
  });

  res.status(201).json({ success: true, result });
});

// @desc    Get the result for a given interview
// @route   GET /api/interviews/:id/result
// @access  Private
const getResult = asyncHandler(async (req, res) => {
  const result = await InterviewResult.findOne({ interview: req.params.id, user: req.user._id }).populate(
    'interview',
    'role experienceLevel difficulty duration completedAt'
  );

  if (!result) {
    res.status(404);
    throw new Error('Result not found — the interview may not be finished yet');
  }

  res.json({ success: true, result });
});

// @desc    Download the interview result as a PDF report
// @route   GET /api/interviews/:id/report
// @access  Private
const downloadReport = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  const result = await InterviewResult.findOne({ interview: req.params.id, user: req.user._id });
  if (!result) {
    res.status(404);
    throw new Error('Result not found — the interview may not be finished yet');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="talentai-report-${interview._id}.pdf"`);

  await streamInterviewReport(res, { interview, result });
});

module.exports = { finishInterview, getResult, downloadReport };
