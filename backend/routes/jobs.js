const express = require("express");
const router = express.Router();
const {
    getAllJobs,
    createJob,
    getJobById,
    updateJob,
    deleteJob,
} = require("../controllers/jobController");
// Import the correct matching controller function
const { getJobMatches } = require("../controllers/matchController"); // Assuming this is correct
// Import validation (CommonJS)
const validate = require("../middleware/validate");
const { jobSchema } = require("../validators/job.validator");

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public (for now)
router.get("/", getAllJobs);

// @route   POST api/jobs
// @desc    Create a job
// @access  Public (for now)
router.post("/", validate(jobSchema), createJob);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Public (for now)
router.get("/:id", getJobById);

// @route   PUT api/jobs/:id
// @desc    Update job by ID
// @access  Public (for now)
router.put("/:id", validate(jobSchema), updateJob);

// @route   DELETE api/jobs/:id
// @desc    Delete job by ID
// @access  Public (for now)
router.delete("/:id", deleteJob);

// Matching Route
// @route   GET api/jobs/:id/match
// @desc    Get developer matches for job ID
// @access  Public (for now)
router.get("/:id/match", getJobMatches);

module.exports = router;
