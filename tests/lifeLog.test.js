import test from "node:test";
import assert from "node:assert/strict";

import {
    addLogEntry,
    getLogEntries,
    initializeLifeLog,
    logActivityStarted,
    logActivityCompleted,
    logActivityAbandoned
} from "../js/lifeLog.js";

// Example life object for testing

const playerLifeHigh = {
    dates: {
        birthDate: "1982-01-01",
        currentDate: "2000-01-01"
    },    
    skills: {
        charisma: {level: 10},
        research: {level: 7},
        medicine: {level: 6}
    },
    vitalStats: {
        money: 1000,
        health: 100,
        wellBeing: 0
    },
    job: {
        jobName: null,
        searchingFor: null,
        jobSearchProgress: 0
    }, 
    education: "Bachelor's",

};

// Tests for addLogEntry

test("check addLogEntry for basic addition to a nonexistant log", () => {
    const life = structuredClone(playerLifeHigh);

    addLogEntry(life, life.dates.currentDate, "memory", "Sample entry");

    assert.equal(life.log[0].id, 1);
    assert.equal(life.log[0].date, life.dates.currentDate);
    assert.equal(life.log[0].type, "memory");
    assert.equal(life.log[0].description, "Sample entry");
    
    assert.equal(life.log.length, 1);

});


test("addLogEntry adds an entry to an existing log", () => {
    const life = structuredClone(playerLifeHigh);
    life.log = [];

    addLogEntry(life, "2000-01-01", "activity", "Started job search");
    addLogEntry(life, "2000-01-05", "discovery", "Learned something");

    assert.equal(life.log.length, 2);
    assert.equal(life.log[0].id, 1);
    assert.equal(life.log[1].id, 2);
});

test("addLogEntry assigns sequential IDs", () => {
    const life = structuredClone(playerLifeHigh);
    life.log = [
        { id: 3, date: "2000-01-01", type: "memory", description: "Entry 1" },
        { id: 7, date: "2000-01-02", type: "activity", description: "Entry 2" }
    ];

    const entry = addLogEntry(
        life, "2000-01-03", "milestone", "Entry 3"
    );

    assert.equal(entry.id, 8);
});

test("addLogEntry stores an optional description", () => {
    const life = structuredClone(playerLifeHigh);

    const entry = addLogEntry(
        life, "2000-01-01", "activity", "Studying Pre-med"
    );

    assert.equal(entry.description, "Studying Pre-med");
});

test("addLogEntry defaults description to empty string", () => {
    const life = structuredClone(playerLifeHigh);

    const entry = addLogEntry(
        life, "2000-01-01", "memory"
    );

    assert.equal(entry.description, "");
});

test("addLogEntry rejects invalid log types", () => {
    const life = structuredClone(playerLifeHigh);

    assert.throws(
        () => addLogEntry(
            life, "2000-01-01", "invalid", "Bad entry"
        ),
        /Invalid life log type/
    );

    assert.equal(life.log, undefined);
});

// Test getLogEntries

test("getLogEntries returns entries newest first", () => {
    const life = structuredClone(playerLifeHigh);
    life.log = [];

    addLogEntry(life, "2000-01-01", "memory", "First");
    addLogEntry(life, "2000-01-02", "activity", "Second");
    addLogEntry(life, "2000-01-03", "milestone", "Third");

    const entries = getLogEntries(life);

    assert.deepEqual(
        entries.map(entry => entry.description),
        ["Third", "Second", "First"]
    );
});

test("getLogEntries does not modify the original log", () => {
    const life = structuredClone(playerLifeHigh);
    life.log = [];

    addLogEntry(life, "2000-01-01", "memory", "First");
    addLogEntry(life, "2000-01-02", "activity", "Second");

    const originalLog = structuredClone(life.log);

    getLogEntries(life);

    assert.deepEqual(life.log, originalLog);
});

test("getLogEntries handles nonexistent log", () => {
    const life = structuredClone(playerLifeHigh);

    assert.deepEqual(getLogEntries(life), []);
});

// Test initiatlizeLifeLog

test("initializeLifeLog records previous death on currentDate", () => {
    const life = structuredClone(playerLifeHigh);

    initializeLifeLog(life, "Died at age 38");

    assert.equal(life.log.length, 1);
    assert.equal(life.log[0].id, 1);
    assert.equal(life.log[0].date, life.dates.currentDate);
    assert.equal(life.log[0].date, "2000-01-01");
    assert.equal(life.log[0].type, "memory");
    assert.equal(life.log[0].description, "Died at age 38");
});

test("initializeLifeLog creates empty log without previous death", () => {
    const life = structuredClone(playerLifeHigh);

    initializeLifeLog(life);

    assert.deepEqual(life.log, []);
});

test("initializeLifeLog clears an existing log", () => {
    const life = structuredClone(playerLifeHigh);
    life.log = [
        { id: 1, date: "1999-01-01", type: "memory", description: "Old entry" }
    ];

    initializeLifeLog(life, "Died at age 38");

    assert.equal(life.log.length, 1);
    assert.equal(life.log[0].id, 1);
    assert.equal(life.log[0].description, "Died at age 38");
});

// Tests for logActivityStarted

test("logActivityStarted records job search", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "findJob",
        target: "Retail Associate"
    };

    const entry = logActivityStarted(life, "2000-01-05", activity);

    assert.equal(life.log.length, 1);
    assert.equal(life.log[0].date, "2000-01-05");
    assert.equal(
        life.log[0].description,
        "Started seeking a job as a Retail Associate"
    );

    assert.equal(entry, life.log[0]);
    assert.equal(entry.id, 1);
});




test("logActivityStarted with an unknown activity", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "newt",
        target: "Retail Associate"
    };

    

    assert.throws(() => logActivityStarted(life, "2000-01-05", activity), 
    { message: `Unknown queued activity: ${activity.name}` })

    assert.equal(life.log, undefined);
});

// Test logActivityCompleted

test("logActivityCompleted shows a successful job search", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "findJob",
        target: "Retail Associate"
    };

    const entry = logActivityCompleted(life, "2000-01-30", activity, "success");

    assert.equal(life.log.length, 1);
    assert.equal(life.log[0].date, "2000-01-30");
    assert.equal(
        life.log[0].description,
        "Got a job as a Retail Associate"    
    );    

    assert.equal(entry, life.log[0]);
    assert.equal(entry.id, 1);
});




test("logActivityCompleted shows a failed job search", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "findJob",
        target: "Retail Associate"
    };

    const entry = logActivityCompleted(life, "2000-01-30", activity, "failure");

    assert.equal(life.log.length, 1);
    assert.equal(life.log[0].date, "2000-01-30");
    assert.equal(
        life.log[0].description,
        "Failed to get a job as a Retail Associate"
    );    

    assert.equal(entry, life.log[0]);
    assert.equal(entry.id, 1);    
});

test("activity logging maintains sequential IDs", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "findJob",
        target: "Retail Associate"
    };

    logActivityStarted(life, "2000-01-05", activity);
    logActivityCompleted(life, "2000-01-30", activity, "success");

    assert.equal(life.log.length, 2);
    assert.equal(life.log[0].id, 1);
    assert.equal(life.log[1].id, 2);
});


test("logActivityCompleted with an unknown activity", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "newt",
        target: "Retail Associate"
    };

    

    assert.throws(() => logActivityCompleted(life, "2000-01-05", activity), 
    { message: `Unknown queued activity: ${activity.name}` })

    assert.equal(life.log, undefined);    
});

test("logActivityCompleted with an unknown result type", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "findJob",
        target: "Retail Associate"
    };

    const result = "newt";

    assert.throws(() => logActivityCompleted(life, "2000-01-05", activity, result), 
    { message: `Unknown result type: ${result}` });

    assert.equal(life.log, undefined);    
});

// Test logActivityAbandoned


test("logActivityAbandoned shows an abandoned job search", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "findJob",
        target: "Retail Associate"
    };

    const entry = logActivityAbandoned(life, "2000-01-30", activity);

    assert.equal(life.log.length, 1);
    assert.equal(life.log[0].date, "2000-01-30");
    assert.equal(
        life.log[0].description,
        "Stopped looking for a job as a Retail Associate"
    );    
    assert.equal(entry, life.log[0]);
    assert.equal(entry.id, 1);    
});

test("logActivityAbandoned with an unknown activity", () => {
    const life = structuredClone(playerLifeHigh);

    const activity = {
        name: "newt",
        target: "Retail Associate"
    };


    assert.throws(() => logActivityAbandoned(life, "2000-01-05", activity), 
    { message: `Unknown queued activity: ${activity.name}` })

    assert.equal(life.log, undefined);    
});

