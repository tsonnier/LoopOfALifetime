// List of skills 
export const skills = {
    charisma: {
        level: 0,
        unlocked: true
    },
    medicine: {
        level: 0,
        unlocked: false
    },
    research: {
        level: 0,
        unlocked: false
    }
}

export const skillProgression = {
    baseCost: 10,
    scale: 20,
    exponent: 2
};

export function study(life, studyHours) {
    if (typeof(studyHours) != "number")
        throw new Error(`studyHours is not a number: ${studyHours}`);
    if (!Number.isFinite(studyHours) || studyHours < 0) {
       throw new Error(`Invalid studyHours: ${studyHours}`);
}

    let remainingHours = studyHours;

    for (const priority of life.studyPriorities)
    {
        if (life.skills[priority.skill] < priority.targetLevel)
            if (remainingHours > 0)
                // Calculate number of hours left to reach next level
    }

    // Process study priorities.
    // Increase skills.
    // Remove completed priorities.
    // Return unused hours and progress information.
}