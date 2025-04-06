const { z } = require("zod");

// Schema for creating/updating a developer profile
const developerSchema = z.object({
    body: z.object({
        // Validate req.body
        name: z
            .string({
                required_error: "Name is required",
            })
            .min(2, "Name must be at least 2 characters"),

        bio: z.string().optional(), // Bio is optional

        skills: z
            .array(z.string(), {
                required_error: "Skills are required",
            })
            .min(1, "At least one skill is required"),
        // Add other fields if needed
    }),
});

// If update has different rules, create separate schema
// export const updateDeveloperSchema = developerSchema.deepPartial();

module.exports = { developerSchema };
