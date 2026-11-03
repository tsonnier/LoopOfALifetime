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
        game.life.birthDate,
        game.life.currentDate
    );

    ageDisplay.textContent =
        `${age.years} years, ${age.daysSinceBirthday} days`;

    statusDisplay.textContent =
        game.running ? "Running" : "Paused";
    
    smartnessDisplay.textContent = game.life.smartness;
    wellBeingDisplay.textContent = game.life.wellBeing;
    moneyDisplay.textContent = game.life.money;
}

function performActivity(activityName, durationInDays = 1) {
    game.life.currentDate = addDays(
        game.life.currentDate,
        durationInDays
    );

    const activity = activities[activityName];
    const effects = activity.effects;
    for(const [effectName, effectValue] of Object.entries(effects)) {
        game.life[effectName] += effectValue;
    }


    // Refresh the displayed age.
    updateDisplay();

    // Record the action in the Life Log.
    ticker.textContent =
    `${activity.name}: ${durationInDays} in-game day(s) passed.`
}

function advanceTime() {
    if (!game.running) {
        return;
    }

    game.life.currentDate = addDays(
        game.life.currentDate,
        game.tickLengthInDays
    );

    updateDisplay();

    ticker.textContent =
        `The date is now ${game.life.currentDate}.`;
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