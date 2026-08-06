const express = require('express');
const { getHistory, deleteHistoryEntry } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getHistory);
router.delete('/:id', deleteHistoryEntry);

module.exports = router;
