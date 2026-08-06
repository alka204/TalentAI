const asyncHandler = require('express-async-handler');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const { generateInterviewQuestions } = require('../services/geminiService');

// @desc    Create a new interview and generate questions via Gemini
// @route   POST /api/interviews
// @access  Private
const createInterview = asyncHandler(async (req, res) => {
  const { role, experienceLevel, duration, difficulty } = req.body;

  const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  const resumeContext = resume?.parsed?.skills?.join(', ') || '';

  const generated = await generateInterviewQuestions({
    role,
    experienceLevel,
    difficulty,
    duration,
    resumeContext,
  });

  const interview = await Interview.create({
    user: req.user._id,
    resume: resume?._id,
    role,
    experienceLevel,
    duration,
    difficulty,
    questions: generated,
    status: 'pending',
  });

  res.status(201).json({ success: true, interview });
});

// @desc    Get a single interview by id (must belong to the requesting user)
// @route   GET /api/interviews/:id
// @access  Private
const getInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  res.json({ success: true, interview });
});

// @desc    Submit an answer for a specific question in an interview
// @route   PATCH /api/interviews/:id/answer
// @access  Private
const submitAnswer = asyncHandler(async (req, res) => {
  const { questionIndex, answer, transcript } = req.body;

  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  if (!interview.questions[questionIndex]) {
    res.status(400);
    throw new Error('Invalid question index');
  }

  interview.questions[questionIndex].answer = answer;
  interview.questions[questionIndex].transcript = transcript || '';
  interview.status = 'in-progress';
  if (!interview.startedAt) interview.startedAt = new Date();

  await interview.save();

  res.json({ success: true, interview });
});

module.exports = { createInterview, getInterview, submitAnswer };
