const { z } = require("zod");

// Schema for creating/updating a job
const jobSchema = z.object({
    body: z.object({
        // Validate req.body
        title: z
            .string({
                required_error: "Title is required",
            })
            .min(2, "Title must be at least 2 characters"),

        description: z
            .string({
                required_error: "Description is required",
            })
            .min(10, "Description must be at least 10 characters"),

        requiredSkills: z
            .array(z.string(), {
                required_error: "Required skills are required",
            })
            .min(1, "At least one skill is required"),
        // Add other fields from your model if they are part of the request body
    }),
    // You could add params validation here too if needed, e.g., for update routes
    // params: z.object({ id: z.string().refine(...) })
});

// If update has slightly different rules (e.g., all optional), create a separate schema
// export const updateJobSchema = jobSchema.deepPartial(); // Example if all fields become optional

module.exports = { jobSchema };
