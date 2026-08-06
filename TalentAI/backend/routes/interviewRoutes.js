const express = require('express');
const { createInterview, getInterview, submitAnswer } = require('../controllers/interviewController');
const { finishInterview, getResult, downloadReport } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createInterview);
router.get('/:id', getInterview);
router.patch('/:id/answer', submitAnswer);
router.post('/:id/finish', finishInterview);
router.get('/:id/result', getResult);
router.get('/:id/report', downloadReport);

module.exports = router;
