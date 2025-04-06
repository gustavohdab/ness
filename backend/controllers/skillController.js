const Job = require("../models/Job");
const Developer = require("../models/Developer");

// @desc    Get distinct skills from both Jobs and Developers
// @route   GET /api/skills
// @access  Public
const getAllDistinctSkills = async (req, res, next) => {
    try {
        // Fetch distinct skills from both collections concurrently
        const [jobSkills, devSkills] = await Promise.all([
            Job.distinct("requiredSkills"),
            Developer.distinct("skills"),
        ]);

        // Combine, deduplicate, and sort the skills
        const allSkillsSet = new Set([...jobSkills, ...devSkills]);
        const sortedSkills = Array.from(allSkillsSet).sort();

        res.json(sortedSkills);
    } catch (err) {
        console.error("Error fetching distinct skills:", err.message);
        next(err);
    }
};

module.exports = {
    getAllDistinctSkills,
};
