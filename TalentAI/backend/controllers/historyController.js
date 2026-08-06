const asyncHandler = require('express-async-handler');
const History = require('../models/History');
const Interview = require('../models/Interview');
const InterviewResult = require('../models/InterviewResult');

// @desc    Get the current user's interview history (search + filter + sort)
// @route   GET /api/history?search=&difficulty=&sortBy=&order=
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
  const { search, difficulty, sortBy = 'completedAt', order = 'desc' } = req.query;

  const query = { user: req.user._id };

  if (search) {
    query.role = { $regex: search, $options: 'i' };
  }

  if (difficulty && difficulty !== 'All') {
    query.difficulty = difficulty;
  }

  const allowedSortFields = ['completedAt', 'overallScore', 'role', 'duration'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'completedAt';

  const history = await History.find(query).sort({ [sortField]: order === 'asc' ? 1 : -1 });

  res.json({ success: true, history });
});

// @desc    Delete a history entry (and its underlying interview + result)
// @route   DELETE /api/history/:id
// @access  Private
const deleteHistoryEntry = asyncHandler(async (req, res) => {
  const entry = await History.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!entry) {
    res.status(404);
    throw new Error('History entry not found');
  }

  // Best-effort cascade cleanup — the history row is the source of truth for
  // the UI, so we don't fail the request if these secondary docs are already gone.
  await Promise.allSettled([
    InterviewResult.deleteOne({ _id: entry.result, user: req.user._id }),
    Interview.deleteOne({ _id: entry.interview, user: req.user._id }),
  ]);

  res.json({ success: true, message: 'History entry deleted' });
});

module.exports = { getHistory, deleteHistoryEntry };
