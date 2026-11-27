// lifeLog.js
// Manages the historical event log for the current life

export const logTypes = [
    "memory",
    "activity",
    "exploration",
    "inquiry",
    "discovery",
    "milestone",
    "obstacle"
];


// Add an entry to the life log
export function addLogEntry(life, date, type, description = "") {

    if (!logTypes.includes(type))
        throw new Error(`Invalid life log type: ${type}`);

    if (!life.log)
        life.log = [];

    const entry = {
        id: life.log.length > 0
            ? Math.max(...life.log.map(entry => entry.id)) + 1
            : 1,
        date,
        type,
        description
    };

    life.log.push(entry);

    return entry;
}


// Return entries newest first without modifying the original array
export function getLogEntries(life) {

    if (!life.log)
        return [];

    return [...life.log].reverse();
}


// Initialize a new life log
export function initializeLifeLog(life, previousDeath = null) {

    life.log = [];

    // The first chronological entry of every life
    // should be the memory of the previous death.
    if (previousDeath) {
        addLogEntry(
            life,
            life.dates.currentDate,
            "memory",
            previousDeath
        );
    }
}


export function logActivityStarted(life, date, activity) {

    switch (activity.name) {

        case "findJob":
            return addLogEntry(
                life,
                date,
                "activity",
                `Started seeking a job as a ${activity.target}`
            );

        default:
            throw new Error(
                `Unknown queued activity: ${activity.name}`
            );
    }
}


export function logActivityCompleted(life, date, activity, result) {

    switch (activity.name) {

        case "findJob":
            switch (result) {
                case "success":
                    return addLogEntry(
                        life,
                        date,
                        "activity",
                        `Got a job as a ${activity.target}`
                    );                    
                case "failure":
                    return addLogEntry(
                        life,
                        date,
                        "activity",
                        `Failed to get a job as a ${activity.target}`
                    );
                default:
                    throw new Error(
                        `Unknown result type: ${result}`
                    );                    
                }

        default:
            throw new Error(
                `Unknown queued activity: ${activity.name}`
            );
    }
}


export function logActivityAbandoned(life, date, activity) {

    switch (activity.name) {

        case "findJob":
            return addLogEntry(
                life,
                date,
                "activity",
                `Stopped looking for a job as a ${activity.target}`
            );

        default:
            throw new Error(
                `Unknown queued activity: ${activity.name}`
            );
    }
}
