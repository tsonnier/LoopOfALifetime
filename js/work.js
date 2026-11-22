import { jobs } from "./jobs.js";

export function work(life, workHours) {

    // Validate the number of hours.
    if (typeof workHours !== "number" ||
        !Number.isFinite(workHours) ||
        workHours < 0) {
        throw new Error(`Invalid workHours: ${workHours}`);
    }

    // Check whether the character has a job.
    const jobId = life.job.jobName;

    if (!jobId) {
        return 0;
    }

    // Look up the job definition in jobs.js.
    const job = jobs[jobId];

    if (!job) {
        throw new Error(`Unknown job: ${jobId}`);
    }

    // Calculate earnings based on hours worked.
    const earnings = job.hourlyPay * workHours;

    // Add earnings to life.vitalStats.money.
    life.vitalStats.money += earnings;

    return earnings;
}