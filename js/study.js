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

export function calculateSkillCost(skillLevel) {
    const { baseCost, scale, exponent } = skillProgression;

    return baseCost *
        Math.pow(1 + skillLevel / scale, exponent);
}

export function calculateRemainingEffort(skillLevel) {
    const currentLevel = Math.floor(skillLevel);
    const progress = skillLevel - currentLevel;

    const totalEffort = calculateSkillCost(currentLevel);

    return totalEffort * (1 - progress);
}

export function applyStudyEffort(skillLevel, effort) {
    let remainingEffort = effort;
    let currentLevel = skillLevel;

    while (remainingEffort > 0
    ) {
        const effortNeeded =
            calculateRemainingEffort(currentLevel);


        if (remainingEffort >= effortNeeded) {
            remainingEffort -= effortNeeded;
            currentLevel = Math.floor(currentLevel) + 1;
        } else {
            const progress =
                remainingEffort / calculateSkillCost(
                    Math.floor(currentLevel)
                );

            currentLevel += progress;
            remainingEffort = 0;
        }
    }

    return {
        skillLevel: currentLevel,
        remainingEffort
    };
}

export function calculateEffortToReachTarget(
    skillLevel,
    targetLevel
) {
    let totalEffort = 0;
    let currentLevel = skillLevel;

    while (currentLevel < targetLevel) {
        const effortNeeded =
            calculateRemainingEffort(currentLevel);

        totalEffort += effortNeeded;
        currentLevel = Math.floor(currentLevel) + 1;
    }

    return totalEffort;
}

export function study(life, studyHours) {
    // TODO: multiply skill effort from metaprogression

    if (typeof(studyHours) != "number")
        throw new Error(`studyHours is not a number: ${studyHours}`);
    if (!Number.isFinite(studyHours) || studyHours < 0)
       throw new Error(`Invalid studyHours: ${studyHours}`);


    let remainingHours = studyHours;

    // Process study priorities.
    for (const priority of life.studyPriorities)
    {
        const skill = life.skills[priority.skill];

        // Skip locked skills
        if (!skill.unlocked) continue;

        // Skip completed priorities
        if (skill.level >= priority.targetLevel) continue;

        if (remainingHours <= 0) break;

        const effortToTarget = calculateEffortToReachTarget(
            skill.level,
            priority.targetLevel
        );

        const effortToApply = Math.min(
            remainingHours,
            effortToTarget
        );

        // Increase skills.
        const result = applyStudyEffort(
            skill.level,
            effortToApply
        );

        skill.level = result.skillLevel;
        remainingHours -= effortToApply;
        
    }

    // Return unused hours and progress information.
}