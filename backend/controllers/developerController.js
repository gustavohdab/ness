const Developer = require("../models/Developer");

// @desc    Get all developers with pagination, filtering, and searching
// @route   GET /api/developers
// @access  Public
const getAllDevelopers = async (req, res, next) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering and Searching parameters
        const { search, skills } = req.query;
        const filter = {};

        // Build search filter using regex (case-insensitive)
        if (search) {
            const regex = new RegExp(search, "i");
            filter.$or = [
                { name: regex },
                { bio: regex },
                // Add other searchable fields if needed, e.g., { skills: regex }
            ];
        }

        // Build skills filter (match developers possessing ALL listed skills)
        if (skills) {
            const skillsArray = skills
                .split(",")
                .map((skill) => skill.trim().toLowerCase())
                .filter((skill) => skill !== "");
            if (skillsArray.length > 0) {
                filter.skills = { $all: skillsArray };
            }
        }

        // Get total number of developers matching the filter
        const totalItems = await Developer.countDocuments(filter);

        // Get developers for the current page matching the filter
        const developers = await Developer.find(filter)
            .sort({ name: 1 }) // Sort alphabetically by name
            .skip(skip)
            .limit(limit);

        res.json({
            data: developers,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (err) {
        console.error("Error in getAllDevelopers:", err.message);
        next(err);
    }
};

// @desc    Create a developer profile
// @route   POST /api/developers
// @access  Public
const createDeveloper = async (req, res) => {
    const { name, bio, skills } = req.body;

    try {
        // Basic validation
        if (!name || !skills || !Array.isArray(skills) || skills.length === 0) {
            return res
                .status(400)
                .json({ msg: "Please provide name and at least one skill." });
        }

        const newDeveloper = new Developer({
            name,
            bio: bio || "", // Use provided bio or default to empty string
            skills,
        });

        const developer = await newDeveloper.save();
        res.status(201).json(developer);
    } catch (err) {
        console.error(err.message);
        if (err.name === "ValidationError") {
            return res
                .status(400)
                .json({ msg: "Validation Error", errors: err.errors });
        }
        res.status(500).send("Server Error");
    }
};

// @desc    Get developer by ID
// @route   GET /api/developers/:id
// @access  Public
const getDeveloperById = async (req, res) => {
    try {
        const developer = await Developer.findById(req.params.id);

        if (!developer) {
            return res.status(404).json({ msg: "Developer not found" });
        }
        res.json(developer);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Developer not found" });
        }
        res.status(500).send("Server Error");
    }
};

// @desc    Update developer by ID
// @route   PUT /api/developers/:id
// @access  Public
const updateDeveloper = async (req, res) => {
    const { name, bio, skills } = req.body;

    const devFields = {};
    if (name) devFields.name = name;
    if (bio !== undefined) devFields.bio = bio; // Allow setting bio to empty string
    if (skills) {
        if (!Array.isArray(skills) || skills.length === 0) {
            return res
                .status(400)
                .json({ msg: "skills must be a non-empty array." });
        }
        devFields.skills = skills;
    }

    try {
        let developer = await Developer.findById(req.params.id);

        if (!developer) {
            return res.status(404).json({ msg: "Developer not found" });
        }

        developer = await Developer.findByIdAndUpdate(
            req.params.id,
            { $set: devFields },
            { new: true, runValidators: true }
        );

        res.json(developer);
    } catch (err) {
        console.error(err.message);
        if (err.name === "ValidationError") {
            return res
                .status(400)
                .json({ msg: "Validation Error", errors: err.errors });
        }
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Developer not found" });
        }
        res.status(500).send("Server Error");
    }
};

// @desc    Delete developer by ID
// @route   DELETE /api/developers/:id
// @access  Public
const deleteDeveloper = async (req, res) => {
    try {
        const developer = await Developer.findById(req.params.id);

        if (!developer) {
            return res.status(404).json({ msg: "Developer not found" });
        }

        await Developer.findByIdAndDelete(req.params.id);

        res.json({ message: "Developer profile deleted successfully" });
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Developer not found" });
        }
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getAllDevelopers,
    createDeveloper,
    getDeveloperById,
    updateDeveloper,
    deleteDeveloper,
};
