const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');
const { uploadBufferToCloudinary } = require('../services/cloudinaryService');
const { extractText, parseResumeText } = require('../services/resumeParserService');

// @desc    Upload a resume PDF, parse it, and store the result
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No resume file uploaded');
  }

  const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer);
  const rawText = await extractText(req.file.buffer);
  const parsed = parseResumeText(rawText);

  const resume = await Resume.create({
    user: req.user._id,
    fileUrl: url,
    fileName: req.file.originalname,
    cloudinaryId: publicId,
    rawText,
    parsed,
  });

  res.status(201).json({ success: true, resume });
});

// @desc    Get the current user's most recent resume
// @route   GET /api/resume
// @access  Private
const getMyResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, resume });
});

module.exports = { uploadResume, getMyResume };
