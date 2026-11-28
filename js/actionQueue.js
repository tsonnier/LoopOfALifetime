

// actionQueue.js
// Manages queued activities and their execution

import { findJob } from "./jobSearch.js";

import {
    logActivityStarted,
    logActivityCompleted,
    logActivityAbandoned
} from "./lifeLog.js";


// Add an action to the queue
export function addAction(life, action) {
    if (!action) {
        throw new Error("Action missing");
    }
    
    if (!action.actionType) {
        throw new Error("Action must have an actionType");
    }    

logActivityStarted(
    life,
    life.dates.currentDate,
    {
        name: action.actionType,
        target: action.target
    }
);

life.actionQueue.push(action);
}

// Remove an action from the queue
export function removeAction(life, index, abandoned = false) {

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= life.actionQueue.length
    ) {
        throw new Error("Invalid action queue index");
    }

    const [action] = life.actionQueue.splice(index, 1);

    if (abandoned) {
        logActivityAbandoned(
            life,
            life.dates.currentDate,
            {
                name: action.actionType,
                target: action.target
            }
        );
    }

    return action;
}


export function processActionQueue(life, availableHours) {
    if (
        typeof availableHours !== "number" ||
        !Number.isFinite(availableHours) ||
        availableHours < 0
    ) {
        throw new Error(`Invalid availableHours: ${availableHours}`);
    }

    let remainingHours = availableHours;
    let index = 0;

    while (
        index < life.actionQueue.length &&
        remainingHours > 0
    ) {

        const action = life.actionQueue[index];

        switch (action.actionType) {

            case "findJob": {

                if (life.job.jobName === action.target) {
                    removeAction(life, index);
                    continue;
                }

                const result = findJob(
                    action.target,
                    life,
                    remainingHours
                );

                if (!result.eligible) {
                    index++;
                    continue;
                }

                remainingHours = result.hoursLeft;

                if (result.jobFound) {
                    removeAction(life, index);

                    logActivityCompleted(
                        life,
                        life.dates.currentDate,
                        {
                            name: action.actionType,
                            target: action.target
                        },
                        "success"
                    );

                    continue;
                }

                break;
            }

            default:
                throw new Error(
                    `Unknown queued activity: ${action.actionType}`
                );
        }
    }

    return remainingHours;
}