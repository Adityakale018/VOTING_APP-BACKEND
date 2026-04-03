const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const candidate = require('./../models/candidate');
const user = require('./../models/user');
const { jwtMiddleware } = require('./../jwt');

const statsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

const checkAdminRole = async (userID) => {
    try {
        const User = await user.findById(userID);
        return User && User.role === 'admin';
    } catch (err) {
        return false;
    }
};

// GET /admin/stats - Fetch real-time voting statistics (admin only)
router.get('/stats', statsLimiter, jwtMiddleware, async (req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'Access denied: admin role required' });
        }

        const candidates = await candidate.find().sort({ voteCount: 'desc' });
        const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);
        const totalCandidates = candidates.length;
        const totalVoters = await user.countDocuments({ role: 'voter' });
        const votedCount = await user.countDocuments({ isvoted: true });

        const stats = {
            totalVotes,
            totalCandidates,
            totalVoters,
            votedCount,
            turnoutPercentage: totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0,
            candidates: candidates.map((c) => ({
                _id: c._id,
                name: c.name,
                party: c.party,
                age: c.age,
                voteCount: c.voteCount || 0,
                percentage: totalVotes > 0 ? Math.round(((c.voteCount || 0) / totalVotes) * 100) : 0,
            })),
        };

        res.status(200).json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
