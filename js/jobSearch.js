import { jobs } from "./jobs.js";

export function calculateJobSearchHours(jobId, stats) {
    const job = jobs[jobId];

    if (!job) {
        throw new Error(`Unknown job: ${jobId}`);
    }

    let totalModifier = 0;

    for (const [stat, modifier] of Object.entries(
        job.jobSearch.modifiers
    )) {
        const statValue = stats[stat] ?? 0;

        totalModifier += statValue * modifier;
    }
    
    const finalSearchHours = job.jobSearch.baseHours / (1 + totalModifier);

    return finalSearchHours;
}

export function meetsJobRequirements(jobId, stats) {
    const job = jobs[jobId];

    if (!job) {
        throw new Error(`Unknown job: ${jobId}`);
    }

    for (const [requirement, value] of Object.entries(
        job.requirements
    )) {

        const playerValue = stats[requirement];

        if(typeof value === "number"){
            if (typeof playerValue !== "number" || playerValue < value) {
                return false; // the player's stat is lower than the minimum threshold for one requirement, or isn't a number
            }   
        }

        else if (typeof value === "string") {
            if (playerValue !== value) {
                return false; // the player's stat is doesn't match the requirement
            }
        }
    }

    return true; // the player's stats have met all threshold
}

export function findJob(jobId, life, workHours) {
    // Validate job ID.
    // Check eligibility.
    // Initialize or continue search.
    // Accumulate progress.
    // Check completion.
}