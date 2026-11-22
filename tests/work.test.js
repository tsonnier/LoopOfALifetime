import test from "node:test";
import assert from "node:assert/strict";

import { 
    work
} from "../js/work.js";


const retailLife = {
    vitalStats: {
        money: 1000
    },
    job: {
        jobName: "retail",
        jobSearchProgress: 0
    },
    education: "High School",

    schedule: {
        work: 45,
        study: 14,
        sleep: 56,
        leisure: 28,
        other: 25
    }
};

const medResearchLife = {
    vitalStats: {
        money: 1000
    },
    job: {
        jobName: "medResearchAssistant",
        jobSearchProgress: 0
    },
    education: "Bachelor's",

    schedule: {
        work: 45,
        study: 14,
        sleep: 56,
        leisure: 28,
        other: 25
    }
};

const unemployedLife = {
    vitalStats: {
        money: 1000
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
    }    
}

const invalidJobLife = {
    vitalStats: {
        money: 1000
    },
    job: {
        jobName: "newt",
        jobSearchProgress: 0
    },
    education: "High School",

    schedule: {
        work: 45,
        study: 14,
        sleep: 56,
        leisure: 28,
        other: 25
    }        
}

const tolerance = 0.0001;

function assertClose(actual, expected) {
    assert.ok(
        Math.abs(actual - expected) < tolerance,
        `Expected ${actual} to be close to ${expected}`
    );
}

// Test cases involving different jobs, different hours

test("Working retail job, 8 hours", () => {
    const life = structuredClone(retailLife);

    assertClose(
        work(life, 8), 
        80)
    
});

test("Working retail, fractional hours", () => {
    const life = structuredClone(retailLife);

    assertClose(
        work(life, 45 / 7),
        (45 / 7) * 10
    );
});

test("Working retail increases money", () => {
    const life = structuredClone(retailLife);

    work(life, 8);

    assertClose(
        life.vitalStats.money, 1080
    );
});

test("Working Medical Research Assistant job, 8 hours", () => {
    const life = structuredClone(medResearchLife);

    assertClose(
        work(life, 8), 
        200
    )
});

test("Working Medical Research Assistant increases money", () => {
    const life = structuredClone(medResearchLife);

    work(life, 8);

    assertClose(
        life.vitalStats.money, 1200);
});

test("Working unemployed job, 8 hours", () => {
    assertClose(
        work(unemployedLife, 8),
        0
    )
});

// Edge cases

test("Working retail, 0 hours", () => {
    assertClose(
        work(retailLife, 0), 
        0)    
});

test("Working does not modify schedule", () => {
    const life = structuredClone(retailLife);
    const originalSchedule = structuredClone(life.schedule);

    work(life, 8);

    assert.deepEqual(life.schedule, originalSchedule);
});

// Error checking

test("Working negative hours", () => {
    const workHours = -3;
    assert.throws(() => work(retailLife, workHours), 
    { message: `Invalid workHours: ${workHours}` })
});

test("Working invalid job", () => {
    const jobId = invalidJobLife.job.jobName;
    assert.throws(() => work(invalidJobLife, 8), 
    { message: `Unknown job: ${jobId}` })
});

test("Working NaN hours", () => {
    const life = structuredClone(retailLife);
    const workHours = NaN;
    assert.throws(() => work(retailLife, workHours), 
    { message: `Invalid workHours: ${workHours}` })
});

test("Working Infinity hours", () => {
    const life = structuredClone(retailLife);
    const workHours = Infinity;
    assert.throws(() => work(retailLife, workHours), 
    { message: `Invalid workHours: ${workHours}` })
});
