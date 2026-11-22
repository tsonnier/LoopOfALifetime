import test from "node:test";
import assert from "node:assert/strict";

import {
    skillProgression, 
    calculateSkillCost,
    applyStudyEffort,
    calculateRemainingEffort,
    study
} from "../js/study.js";

const tolerance = 0.0001;

function assertClose(actual, expected) {
    assert.ok(
        Math.abs(actual - expected) < tolerance,
        `Expected ${actual} to be close to ${expected}`
    );
}

// calculateSkillCost tests

test("calculateSkillCost for skill level 0 should be 10 (hours)", () => {
    assertClose(
        calculateSkillCost(0), 
        10.0
    );
});


test("calculateSkillCost for skill level 1 should be 11.025 (hours)", () => {
    assertClose(
        calculateSkillCost(1),
        11.025
    );
});

test("calculateSkillCost for skill level 5 should be 15.625 (hours)", () => {
    assertClose(
        calculateSkillCost(5),
        15.625
    );
});

// calculateRemainingEffort tests

test("calculateRemainingEffort at the beginning of a level", () => {
    assertClose(
        calculateRemainingEffort(0),
        10
    );
});

test("calculateRemainingEffort halfway through a level", () => {
    assertClose(
        calculateRemainingEffort(0.5),
        5
    );
});

test("calculateRemainingEffort at level 3.4", () => {
    assertClose(
        calculateRemainingEffort(3.4),
        calculateSkillCost(3) * 0.6
    );
});

// applyStudyEffort tests

test("applyStudyEffort completes one skill level", () => {
    const result = applyStudyEffort(0, 10);

    assertClose(result.skillLevel, 1);
    assertClose(result.remainingEffort, 0);
});

test("applyStudyEffort makes fractional progress", () => {
    const result = applyStudyEffort(0, 5);

    assertClose(result.skillLevel, 0.5);
    assertClose(result.remainingEffort, 0);
});

test("applyStudyEffort advances through multiple levels", () => {
    const result = applyStudyEffort(0, 21.025);

    assertClose(result.skillLevel, 2);
    assertClose(result.remainingEffort, 0);
});

test("applyStudyEffort preserves unused effort", () => {
    const result = applyStudyEffort(0, 5);

    assertClose(result.skillLevel, 0.5);
    assertClose(result.remainingEffort, 0);
});


test("study skips completed priorities and processes the next one", () => {
    const life = {
        skills: {
            charisma: { level: 5, unlocked: true },
            medicine: { level: 0, unlocked: true }
        },
        studyPriorities: [
            { skill: "charisma", targetLevel: 5 },
            { skill: "medicine", targetLevel: 1 }
        ]
    };

    study(life, 10);

    assert.equal(life.skills.charisma.level, 5);
    assert.equal(life.skills.medicine.level, 1);
});