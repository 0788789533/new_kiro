const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controller/authentication');
const protect = require('../middleware/authMiddleware');

router.post('/registers', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
