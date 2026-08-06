const asyncHandler = require('express-async-handler');
const History = require('../models/History');

// @desc    Get overview stats for the dashboard (counts, average score,
//          practice time, score trend, and the 5 most recent interviews)
// @route   GET /api/dashboard/overview
// @access  Private
const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const history = await History.find({ user: userId }).sort({ completedAt: -1 });

  const interviewsCompleted = history.length;

  const practiceTimeMinutes = history.reduce((sum, entry) => sum + (entry.duration || 0), 0);

  const averageScore = interviewsCompleted
    ? Math.round(history.reduce((sum, entry) => sum + entry.overallScore, 0) / interviewsCompleted)
    : null;

  // Improvement: average of the 3 most recent sessions vs. the 3 oldest.
  // Chronological order needed for this comparison (history above is newest-first).
  let improvement = null;
  if (interviewsCompleted >= 2) {
    const chronological = [...history].reverse();
    const sliceSize = Math.min(3, Math.floor(chronological.length / 2)) || 1;

    const earliest = chronological.slice(0, sliceSize);
    const latest = chronological.slice(-sliceSize);

    const avg = (arr) => arr.reduce((sum, e) => sum + e.overallScore, 0) / arr.length;
    improvement = Math.round(avg(latest) - avg(earliest));
  }

  const recentInterviews = history.slice(0, 5).map((entry) => ({
    id: entry._id,
    interviewId: entry.interview,
    role: entry.role,
    difficulty: entry.difficulty,
    duration: entry.duration,
    overallScore: entry.overallScore,
    completedAt: entry.completedAt,
  }));

  res.json({
    success: true,
    stats: {
      interviewsCompleted,
      averageScore,
      practiceTimeMinutes,
      improvement,
    },
    recentInterviews,
  });
});

module.exports = { getOverview };
