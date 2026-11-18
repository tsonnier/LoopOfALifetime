export const activities = {
    study: {
        name: "Study",
        effects: {
            "vitalStats.smartness": 1,
            "vitalStats.wellBeing": -1
        }
    },

    relax: {
        name: "Relax",
        effects: {
            "vitalStats.wellBeing": 1
        }
    }, 

    work: {
        name: "Work",
        effects: {
            "vitalStats.money": 100,
            "vitalStats.wellBeing": -1
        }
    }
    
};