const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Developer name is required."],
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
            default: "",
        },
        skills: [
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
developerSchema.index({ name: 1 });
developerSchema.index({ bio: 1 });
developerSchema.index({ skills: 1 });

module.exports = mongoose.model("Developer", developerSchema);
