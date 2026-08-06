const express = require('express');
const { getOverview } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);

module.exports = router;
