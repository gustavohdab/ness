const express = require("express");
const router = express.Router();
const {
    getAllDevelopers,
    createDeveloper,
    getDeveloperById,
    updateDeveloper,
    deleteDeveloper,
} = require("../controllers/developerController");
// Import validation (CommonJS)
const validate = require("../middleware/validate");
const { developerSchema } = require("../validators/developer.validator");

// @route   GET api/developers
// @desc    Get all developers
// @access  Public (for now)
router.get("/", getAllDevelopers);

// @route   POST api/developers
// @desc    Create a developer profile
// @access  Public (for now)
router.post("/", validate(developerSchema), createDeveloper);

// @route   GET api/developers/:id
// @desc    Get developer by ID
// @access  Public (for now)
router.get("/:id", getDeveloperById);

// @route   PUT api/developers/:id
// @desc    Update developer by ID
// @access  Public (for now)
router.put("/:id", validate(developerSchema), updateDeveloper);

// @route   DELETE api/developers/:id
// @desc    Delete developer by ID
// @access  Public (for now)
router.delete("/:id", deleteDeveloper);

module.exports = router;
