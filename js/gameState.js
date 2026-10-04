// gameState.js
// Details the game state and the variables describing it

const game = {
    // Current life
    life: {
        ageInDays: 6570,
        money: 1000,
        health: 100,
        job: null
        education: "none"
    },

    // Things that survive the loop
    meta: {
        loop: 0,
        knowledge: {},
        achievements: {},
        permanentUpgrades: {}
    }
};