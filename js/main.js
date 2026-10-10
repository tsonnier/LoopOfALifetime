// main.js
// Entry point into the game via the browser

import { game } from "./gameState.js";

function setStatVisible(statName, visible) {
    const stat = document.getElementById(`${statName}-stat`);

    if (!stat) {
        console.error(`Could not find stat: ${statName}-stat`);
        return;
    }

    stat.classList.toggle("hidden", !visible);
}

// Health and Disease start hidden in index.html.
// Test revealing Health by uncommenting this line:
// setStatVisible("health", true);

// Test hiding Education:
//setStatVisible("education", false);