const mongoose = require("mongoose");

const connectDB = async () => {
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
        console.error(
            "FATAL ERROR: MONGODB_URI is not defined in environment variables."
        );
        process.exit(1); // Exit process with failure
    }

    try {
        await mongoose.connect(dbUri, {
            // Mongoose 6+ no longer requires these options, but keep for reference/older versions
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
