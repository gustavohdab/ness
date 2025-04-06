const express = require("express");
const router = express.Router();
const { getAllDistinctSkills } = require("../controllers/skillController");

// @route   GET /api/skills
// @desc    Get all distinct skills
// @access  Public
router.get("/", getAllDistinctSkills);

module.exports = router;
