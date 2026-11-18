// gameState.js
// Details the game state and the variables describing it

export const game = {
    // Current life
    life: {
        dates: {
            birthDate: "1982-01-01",
            currentDate: "2000-01-01"
        },

        vitalStats: {
            money: 1000,
            health: 100,
            smartness: 0,
            wellBeing: 0
        },
        job: {
            jobName: null,
            jobSearchProgress: 0
        },
        education: "High School",

        schedule: {
            work: 45,
            study: 14,
            sleep: 56,
            leisure: 28,
            other: 25
        },
        actionQueue: [],
        // Example Queue: 
        //  {
        //      activity: "findJob",
        //      target: "retail"
        //   }
        studyPriorities: [],
        // Example Priority Queue:
        //  {
        //      skill: "charisma",
        //      targetLevel: 5
        //  }
        skills: []
    },

    // Things that survive the loop
    meta: {
        loop: 0,
        knowledge: {},
        achievements: {},
        permanentUpgrades: {}
    },

    // Simulation timing
    tickLengthInDays: 1,
    tickTimeInMs: 1000,

    running: false
};