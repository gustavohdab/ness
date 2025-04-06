const Job = require("../models/Job");

// @desc    Get all jobs with pagination, filtering, and searching
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res, next) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Default limit to 10
        const skip = (page - 1) * limit;

        // Filtering and Searching parameters
        const { search, skills } = req.query;
        const filter = {};

        // Build search filter using regex (case-insensitive)
        if (search) {
            const regex = new RegExp(search, "i"); // 'i' for case-insensitive
            filter.$or = [{ title: regex }, { description: regex }];
        }

        // Build skills filter (match jobs requiring ALL listed skills)
        if (skills) {
            // Split comma-separated string, trim whitespace, filter empty strings, convert to lowercase
            const skillsArray = skills
                .split(",")
                .map((skill) => skill.trim().toLowerCase())
                .filter((skill) => skill !== "");
            if (skillsArray.length > 0) {
                filter.requiredSkills = { $all: skillsArray };
            }
        }

        // Get total number of jobs matching the filter
        const totalItems = await Job.countDocuments(filter);

        // Get jobs for the current page matching the filter
        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        res.json({
            data: jobs,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (err) {
        console.error("Error in getAllJobs:", err.message);
        next(err);
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Public
const createJob = async (req, res) => {
    const { title, description, requiredSkills } = req.body;

    try {
        // Basic validation
        if (
            !title ||
            !description ||
            !requiredSkills ||
            !Array.isArray(requiredSkills) ||
            requiredSkills.length === 0
        ) {
            return res.status(400).json({
                msg: "Please provide title, description, and at least one required skill.",
            });
        }

        const newJob = new Job({
            title,
            description,
            requiredSkills,
        });

        const job = await newJob.save();
        res.status(201).json(job); // Return 201 Created status
    } catch (err) {
        console.error(err.message);
        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            return res
                .status(400)
                .json({ msg: "Validation Error", errors: err.errors });
        }
        res.status(500).send("Server Error");
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        // Handle invalid ObjectId format
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.status(500).send("Server Error");
    }
};

// @desc    Update job by ID
// @route   PUT /api/jobs/:id
// @access  Public
const updateJob = async (req, res) => {
    const { title, description, requiredSkills } = req.body;

    // Build job object based on fields submitted
    const jobFields = {};
    if (title) jobFields.title = title;
    if (description) jobFields.description = description;
    if (requiredSkills) {
        if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
            return res
                .status(400)
                .json({ msg: "requiredSkills must be a non-empty array." });
        }
        jobFields.requiredSkills = requiredSkills;
    }

    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        // Update
        job = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: jobFields },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        res.json(job);
    } catch (err) {
        console.error(err.message);
        if (err.name === "ValidationError") {
            return res
                .status(400)
                .json({ msg: "Validation Error", errors: err.errors });
        }
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.status(500).send("Server Error");
    }
};

// @desc    Delete job by ID
// @route   DELETE /api/jobs/:id
// @access  Public
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        // In Mongoose 5+, findByIdAndDelete is preferred
        await Job.findByIdAndDelete(req.params.id);
        // For older Mongoose versions, use: await job.remove();

        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getAllJobs,
    createJob,
    getJobById,
    updateJob,
    deleteJob,
};
