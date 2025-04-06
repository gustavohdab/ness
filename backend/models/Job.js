const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required."],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required."],
            trim: true,
        },
        requiredSkills: [
            {
                type: String,
                required: [true, "At least one skill is required."],
                trim: true,
                lowercase: true, // Standardize skills for matching
            },
        ],
    },
    { timestamps: true }
);

// Indexes for searching and filtering
jobSchema.index({ title: 1 });
jobSchema.index({ description: 1 });
jobSchema.index({ requiredSkills: 1 }); // Keep skill index

module.exports = mongoose.model("Job", jobSchema);
