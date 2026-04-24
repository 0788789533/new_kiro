const History = require('../model/history');

// GET all history for logged-in user
const getHistory = async (req, res) => {
    try {
        const history = await History.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE all history for logged-in user
const clearHistory = async (req, res) => {
    try {
        await History.deleteMany({ user: req.user.id });
        res.status(200).json({ message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getHistory, clearHistory };
