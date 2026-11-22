// schedule.js

const TOTAL_WEEKLY_HOURS = 168;
const REDISTRIBUTION_PRIORITY = [
    "other",
    "leisure",
    "study",
    "work"
];


export function getWeeklyHours(schedule) {
    return Object.values(schedule).reduce(
        (total, hours) => total + hours,
        0
    );
}

export function validateSchedule(schedule) {
    // Correct invalid values.
    for (const activity of Object.keys(schedule)) {
        if (!Number.isFinite(schedule[activity]) ||
            schedule[activity] < 0) {
            schedule[activity] = 0;
        }
    }

    let difference =
        TOTAL_WEEKLY_HOURS - getWeeklyHours(schedule);

    if (difference > 0) {
        schedule.other += difference;
    } else if (difference < 0) {
        difference = Math.abs(difference);

        for (const activity of REDISTRIBUTION_PRIORITY) {
            const reduction = Math.min(
                schedule[activity],
                difference
            );

            schedule[activity] -= reduction;
            difference -= reduction;

            if (difference === 0) break;
        }
    }

    return schedule;
}

export function getDailySchedule(schedule) {
    const dailySchedule = {};

    for (const [activity, hours] of Object.entries(schedule)) {
        dailySchedule[activity] = hours / 7;
    }

    return dailySchedule;
}