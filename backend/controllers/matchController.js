const { findMatchesForJob } = require("../services/matchingService");

// @desc    Get developer matches for a specific job
// @route   GET /api/jobs/:id/match
// @access  Public
const getJobMatches = async (req, res) => {
    try {
        const jobId = req.params.id;
        const matches = await findMatchesForJob(jobId);
        res.json(matches);
    } catch (err) {
        console.error(
            `Error in match controller for job ${req.params.id}: ${err.message}`
        );
        // Use status code from service error if available, otherwise default to 500
        res.status(err.statusCode || 500).json({
            message: err.message || "Server Error",
        });
    }
};

module.exports = {
    getJobMatches,
};
