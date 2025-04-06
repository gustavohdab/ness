require("dotenv").config(); // Load .env from backend/
const mongoose = require("mongoose");
const connectDB = require("../config/db"); // Adjust path if needed
const Developer = require("../models/Developer"); // Adjust path if needed

// Sample Data
const developers = [];
for (let i = 1; i <= 30; i++) {
    // Create 30 sample developers
    developers.push({
        name: `Developer ${String.fromCharCode(64 + i)}`, // Developer A, Developer B, etc.
        bio: `Bio for Developer ${String.fromCharCode(
            64 + i
        )}. Experienced in various technologies.`,
        skills: [
            `dev_skill${(i % 6) + 1}`,
            `dev_skill${((i + 2) % 6) + 1}`,
            `common_skill`,
        ], // Example skills
    });
}

// Connect to DB
connectDB();

// Import data into DB
const importData = async () => {
    try {
        await Developer.deleteMany();
        console.log("Developers Destroyed!");

        await Developer.insertMany(developers);
        console.log("Developers Imported!");
        process.exit();
    } catch (error) {
        console.error(`Error importing developer data: ${error}`);
        process.exit(1);
    }
};

// Destroy data from DB
const destroyData = async () => {
    try {
        await Developer.deleteMany();
        console.log("Developers Destroyed!");
        process.exit();
    } catch (error) {
        console.error(`Error destroying developer data: ${error}`);
        process.exit(1);
    }
};

// Check for command line argument '-d' to destroy data
if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}

// Ensure disconnection on script termination errors
process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("MongoDB disconnected on app termination");
    process.exit(0);
});
