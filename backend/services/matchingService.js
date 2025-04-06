const Job = require("../models/Job");
const Developer = require("../models/Developer");

/**
 * Calculates a match score between job skills and developer skills.
 * Score = (number of matching skills) / (total required job skills)
 * @param {string[]} jobSkills - Array of required skills for the job (lowercase).
 * @param {string[]} devSkills - Array of skills the developer has (lowercase).
 * @returns {number} - The match score (0 to 1).
 */
const calculateMatchScore = (jobSkills, devSkills) => {
    if (!jobSkills || jobSkills.length === 0) {
        return 0; // No required skills means no match basis
    }
    if (!devSkills || devSkills.length === 0) {
        return 0; // No developer skills means no match
    }

    const jobSkillSet = new Set(jobSkills);
    const devSkillSet = new Set(devSkills);

    let intersectionSize = 0;
    for (const skill of devSkillSet) {
        if (jobSkillSet.has(skill)) {
            intersectionSize++;
        }
    }

    return intersectionSize / jobSkills.length;
};

/**
 * Finds and ranks developer matches for a given job ID based on skill overlap.
 * @param {string} jobId - The ID of the job to find matches for.
 * @returns {Promise<Array<{developer: object, score: number}>>} - A promise that resolves to a ranked list of matches.
 * @throws {Error} - Throws an error if the job is not found or another server error occurs.
 */
const findMatchesForJob = async (jobId) => {
    try {
        // 1. Fetch Job
        const job = await Job.findById(jobId);
        if (!job) {
            // Indicate job not found specifically for the controller to handle
            const error = new Error("Job not found");
            error.statusCode = 404;
            throw error;
        }
        const jobSkills = job.requiredSkills || []; // Ensure it's an array

        // 2. Fetch Developers
        // Optimization: Could potentially filter devs here based on DB index if needed
        const developers = await Developer.find();

        // 3. Calculate Scores
        const matches = [];
        for (const developer of developers) {
            const devSkills = developer.skills || []; // Ensure it's an array
            const score = calculateMatchScore(jobSkills, devSkills);

            // 4. Filter & Store
            if (score > 0) {
                matches.push({
                    developer: developer.toObject(), // Convert Mongoose doc to plain object if needed
                    score: score,
                });
            }
        }

        // 5. Rank
        matches.sort((a, b) => b.score - a.score); // Sort descending by score

        return matches;
    } catch (err) {
        // Re-throw specific errors or a generic server error
        if (err.statusCode === 404) {
            throw err;
        }
        console.error(
            `Error in matching service for job ${jobId}: ${err.message}`
        );
        const serverError = new Error("Server error during matching process");
        serverError.statusCode = 500;
        throw serverError;
    }
};

module.exports = {
    findMatchesForJob,
    // Potentially export calculateMatchScore if needed elsewhere
};
