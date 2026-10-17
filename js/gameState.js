 // gameState.js
// Details the game state and the variables describing it

export const game = {
    // Current life
    life: {
        birthDate: "2000-02-29",
        currentDate: "2024-02-29",
        money: 1000,
        health: 100,
        smartness: 0,
        wellBeing: 0,
        job: null,
        education: "High School"
    },

    // Things that survive the loop
    meta: {
        loop: 0,
        knowledge: {},
        achievements: {},
        permanentUpgrades: {}
    },

    // Simulation timing
    tickLengthInDays: 30,
    tickTimeInMs: 1000,

    running: false
};