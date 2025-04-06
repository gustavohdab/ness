// Generic validation middleware using Zod
const validate = (schema) => async (req, res, next) => {
    try {
        // safeParse returns a result object with success/error properties
        const result = await schema.safeParseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!result.success) {
            // Format Zod errors for a cleaner response
            const formattedErrors = result.error.flatten((issue) => ({
                message: issue.message,
                errorCode: issue.code,
            }));

            // Respond with 400 Bad Request and the formatted errors
            return res.status(400).json({
                status: "fail",
                message: "Validation failed",
                errors: formattedErrors, // Send formatted errors
            });
        }

        // If validation succeeds, attach parsed data (optional, but can be useful)
        // req.validatedData = result.data;

        // Proceed to the next middleware or route handler
        return next();
    } catch (error) {
        // Catch unexpected errors during validation itself
        console.error("Validation Middleware Error:", error);
        // Pass the error to the global error handler
        return next(error);
    }
};

// Use CommonJS export for compatibility with server.js
module.exports = validate;
