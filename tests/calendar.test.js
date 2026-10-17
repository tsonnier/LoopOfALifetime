import test from "node:test";
import assert from "node:assert/strict";

import {
    addDays,
    calculateAge
} from "../js/calendar.js";

test("calculates age on an exact birthday", () => {
    assert.deepEqual(
        calculateAge("2000-01-01", "2018-01-01"),
        { years: 18, daysSinceBirthday: 0 }
    );
});

test("calculates days since the last birthday", () => {
    assert.deepEqual(
        calculateAge("2000-01-01", "2018-01-31"),
        { years: 18, daysSinceBirthday: 30 }
    );
});

test("handles February 29 birthdays", () => {
    assert.deepEqual(
        calculateAge("2000-02-29", "2021-02-27"),
        { years: 20, daysSinceBirthday: 364 }
    );

    assert.deepEqual(
        calculateAge("2000-02-29", "2021-02-28"),
        { years: 21, daysSinceBirthday: 0 }
    );

    assert.deepEqual(
        calculateAge("2000-02-29", "2024-02-29"),
        { years: 24, daysSinceBirthday: 0 }
    );
});

test("advances across a month boundary", () => {
    assert.equal(
        addDays("2021-01-31", 1),
        "2021-02-01"
    );
});

test("handles leap days when advancing time", () => {
    assert.equal(
        addDays("2024-02-28", 1),
        "2024-02-29"
    );

    assert.equal(
        addDays("2024-02-29", 1),
        "2024-03-01"
    );
});

test("advances across a year boundary", () => {
    assert.equal(
        addDays("2021-12-31", 1),
        "2022-01-01"
    );
});