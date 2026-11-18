// main.js
// Entry point for the game

import { game } from "./gameState.js";
import { activities } from "./activities.js"
import {
    addDays,
    calculateAge
} from "./calendar.js";

const ageDisplay = document.getElementById("age");
const statusDisplay = document.getElementById("status");
const ticker = document.getElementById("ticker");
const smartnessDisplay = document.getElementById("smartness");
const wellBeingDisplay = document.getElementById("well-being");
const moneyDisplay = document.getElementById("money");


function updateDisplay() {
    const age = calculateAge(
        game.life.dates.birthDate,
        game.life.dates.currentDate
    );

    ageDisplay.textContent =
        `${age.years} years, ${age.daysSinceBirthday} days`;

    statusDisplay.textContent =
        game.running ? "Running" : "Paused";
    
    smartnessDisplay.textContent = game.life.vitalStats.smartness;
    wellBeingDisplay.textContent = game.life.vitalStats.wellBeing;
    moneyDisplay.textContent = game.life.vitalStats.money;
}

function applyEffect(target, path, value) {
    const properties = path.split(".");
    const property = properties.pop();

    const object = properties.reduce(
        (current, key) => {
            if (current === undefined || current === null) {
                throw new Error(`Invalid effect path: ${path}`);
            }

            return current[key];
        },
        target
    );

    if (
        object === undefined ||
        object === null ||
        typeof object[property] !== "number"
    ) {
        throw new Error(`Invalid effect target: ${path}`);
    }

    object[property] += value;

}

function performActivity(activityName, durationInDays = 1) {
    game.life.dates.currentDate = addDays(
        game.life.dates.currentDate,
        durationInDays
    );

    const activity = activities[activityName];
    if (!activity) {
        throw new Error(`Unknown activity: ${activityName}`);
    }

    for (const [effectName, effectValue] of Object.entries(activity.effects)) {
        applyEffect(game.life, effectName, effectValue);
    }

    updateDisplay();

    ticker.textContent =
        `${activity.name}: ${durationInDays} in-game day(s) passed.`;
}

function simulateDay() {
    if (!game.running) {
        return;
    }

    // Process daily schedule.
    // Calculate allocated Work hours.
    // Process job-search activity.
    // Apply other daily changes.
    // Advance calendar.
    // Update display.    
    // Process the schedule.
    // Apply daily changes.
    // Update the display.
    updateDisplay();
}

function advanceTime() {
    if (!game.running) {
        return;
    }

    game.life.dates.currentDate = addDays(
        game.life.dates.currentDate,
        game.tickLengthInDays
    );

    updateDisplay();

    ticker.textContent =
        `The date is now ${game.life.dates.currentDate}.`;
}

document.getElementById("run-button").addEventListener("click", () => {
    game.running = true;
    updateDisplay();
    ticker.textContent = "Time is passing.";
});

document.getElementById("pause-button").addEventListener("click", () => {
    game.running = false;
    updateDisplay();
    ticker.textContent = "Time has stopped.";
});

document.getElementById("study-button").addEventListener("click", () => {
        performActivity("study");
    });

document.getElementById("relax-button").addEventListener("click", () => {
        performActivity("relax");
    });

document.getElementById("work-button").addEventListener("click", () => {
        performActivity("work");
    });

// Advance one in-game day per real-world number of milliseconds in game.tickTimeinMs.
setInterval(advanceTime, game.tickTimeInMs);

updateDisplay();