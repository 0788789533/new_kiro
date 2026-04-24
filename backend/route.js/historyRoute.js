const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getHistory, clearHistory } = require('../controller/historyController');

router.get('/', protect, getHistory);
router.delete('/', protect, clearHistory);

module.exports = router;
