import test from "node:test";
import assert from "node:assert/strict";

import { 
    calculateJobSearchHours, 
    meetsJobRequirements 
} from "../js/jobSearch.js";

const playerStatsHigh = {
    charisma: 10,
    education: "Bachelor's",
    research: 7,
    medicine: 6    
};

const playerStatsLow = {
    charisma: 1,
    education: "High School"
};

const tolerance = 0.0001;

test("Retail job has no requirements.", () => {
    assert.equal(
        meetsJobRequirements("retail", playerStatsLow),
        true
    );
});

test("Medical Research Assistant rejects insufficient qualifications.", () => {
    assert.equal(
        meetsJobRequirements("medResearchAssistant", playerStatsLow),
        false
    );
});

test("Medical Research Assistant accepts sufficient qualifications.", () => {
    assert.equal(
        meetsJobRequirements("medResearchAssistant", playerStatsHigh),
        true
    );
});

test("Throws an error for an unknown job", () => {
    assert.throws(
        () => meetsJobRequirements("nonexistent", playerStatsHigh),
        { message: "Unknown job: nonexistent" }
    );
});

test("rejects medical research assistant when research is insufficient", () => {
    const stats = {
        education: "Bachelor's",
        research: 4,
        medicine: 6
    };

    assert.equal(
        meetsJobRequirements("medResearchAssistant", stats),
        false
    );
});



test("checks job search time for retail job with base statistics", () => {
    assert.ok(
        Math.abs(
            calculateJobSearchHours("retail", playerStatsLow) - 19.0476
        ) < tolerance
    );
});

test("checks job search time for the Medical Research Assistant with higher job stats", () => {
    assert.ok(
        Math.abs(
            calculateJobSearchHours("medResearchAssistant", playerStatsHigh) - 14.2857
        ) < tolerance
    );
});