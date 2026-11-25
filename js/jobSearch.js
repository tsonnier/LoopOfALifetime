import { jobs } from "./jobs.js";

export function calculateJobSearchHours(jobId, life) {
    const job = jobs[jobId];

    if (!job) {
        throw new Error(`Unknown job: ${jobId}`);
    }

    let totalModifier = 0;

    for (const [stat, modifier] of Object.entries(
        job.jobSearch.modifiers
    )) {
        const statValue = life.skills[stat]?.level ?? 0;

        totalModifier += statValue * modifier;
    }
    
    const finalSearchHours = job.jobSearch.baseHours / (1 + totalModifier);

    return finalSearchHours;
}

function getRequirementValue(life, requirement) {
    if (requirement === "education") {
        return life.education;
    }

    if (requirement in life.vitalStats) {
        return life.vitalStats[requirement];
    }

    if (requirement in life.skills) {
        return life.skills[requirement].level;
    }

    return undefined;    
}

export function meetsJobRequirements(jobId, life) {
    const job = jobs[jobId];

    if (!job) {
        throw new Error(`Unknown job: ${jobId}`);
    }

    for (const [requirement, value] of Object.entries(
        job.requirements
    )) {
        const playerValue = getRequirementValue(life, requirement); // Retrieve the requirement from the life object

        if (typeof value === "number") {
            if (typeof playerValue !== "number" ||
                playerValue < value) {
                return false;
            }
        } else if (typeof value === "string") {
            if (playerValue !== value) {
                return false;
            }
        }
    }

    return true; // the player's stats have met all threshold
}

export function findJob(jobId, life, searchHours) {
    // Validate work hours
    if (typeof searchHours !== "number")
        throw new Error(`searchHours is not a number: ${searchHours}`);
    if (!Number.isFinite(searchHours) || searchHours < 0)
       throw new Error(`Invalid searchHours: ${searchHours}`);

    const returnObject = {
        jobFound: false,
        hoursLeft: searchHours
    }
    
    // Validate job ID.
    if (!jobId) {
        return returnObject;
    }

    // Look up the job definition in jobs.js.
    const job = jobs[jobId];

    if (!job) {
        throw new Error(`Unknown job: ${jobId}`);
    }

    // If the character already has this job, return without searching for it
    if (jobId === life.job.jobName)
        return returnObject;

    // Check eligibility.
    if(!meetsJobRequirements(jobId, life)) {
        if(life.job.searchingFor === jobId) {
            life.job.searchingFor = null;
            life.job.jobSearchProgress = 0;
        }
        return returnObject;
    }

    // Initialize or continue search.
    // If the current job being sought is the same, continue.  Otherwise, set the new job and initiallize the search.
    if (jobId !== life.job.searchingFor)  { // Looking for a new job, restart the search
        life.job.searchingFor = jobId;
        life.job.jobSearchProgress = 0;
    }
    
    // Accumulate progress.
    const totalHours = calculateJobSearchHours(jobId, life);
    const remainingHours = Math.max( // Error handling in case totalHours is somehow negative
        0,
        totalHours - life.job.jobSearchProgress
    );

    // Check completion.
    if(remainingHours <= searchHours) { // Job found, set the job to the new job
        life.job.jobName = jobId;
        life.job.searchingFor = null;
        life.job.jobSearchProgress = 0;

        returnObject.jobFound = true;
        returnObject.hoursLeft = searchHours - remainingHours;
        return returnObject;
    }
    else { // Job not found yet, apply hours to the progress
        life.job.jobSearchProgress += searchHours;
        
        returnObject.hoursLeft = 0;
        return returnObject;
    }    
}