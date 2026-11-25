import test from "node:test";
import assert from "node:assert/strict";

import { 
    calculateJobSearchHours, 
    meetsJobRequirements,
    findJob
} from "../js/jobSearch.js";

// Helper functions: 

function assertClose(actual, expected) {
    assert.ok(
        Math.abs(actual - expected) < tolerance,
        `Expected ${actual} to be close to ${expected}`
    );
}


// default Life objects for testing, other variables

const playerLifeHigh = {
    
    skills: {
        charisma: {level: 10},
        research: {level: 7},
        medicine: {level: 6}
    },
    vitalStats: {},
    job: {
        jobName: null,
        searchingFor: null,
        jobSearchProgress: 0
    }, 
    education: "Bachelor's",

};

const playerLifeLow = {
    skills: {
        charisma: {level: 1}
    },
    
    vitalStats: {},
    job: {
        jobName: null,
        searchingFor: null,
        jobSearchProgress: 0
    },
    education: "High School"
};

const tolerance = 0.0001;

// Testing meetsJobRequirements

test("Retail job has no requirements.", () => {
    assert.equal(
        meetsJobRequirements("retail", playerLifeLow),
        true
    );
});

test("Medical Research Assistant rejects insufficient qualifications.", () => {
    assert.equal(
        meetsJobRequirements("medResearchAssistant", playerLifeLow),
        false
    );
});

test("Medical Research Assistant accepts sufficient qualifications.", () => {
    assert.equal(
        meetsJobRequirements("medResearchAssistant", playerLifeHigh),
        true
    );
});

test("rejects medical research assistant when research is insufficient", () => {
    const life = {
        vitalStats: {},
        education: "Bachelor's",
        skills: {
            research: {level: 4},
            medicine: {level: 6}
        }
    };

    assert.equal(
        meetsJobRequirements("medResearchAssistant", life),
        false
    );
});

test("rejects medical research assistant when skills are missing entirely", () => {
    const life = {
        vitalStats: {},
        education: "Bachelor's",
        skills: {}
    };

    assert.equal(
        meetsJobRequirements("medResearchAssistant", life),
        false
    );
});

test("rejects medical research assistant when education is insufficient", () => {
    const life = {
        vitalStats: {},
        education: "High School",
        skills: {
            research: {level: 5},
            medicine: {level: 6}
        }
    };

    assert.equal(
        meetsJobRequirements("medResearchAssistant", life),
        false
    );
});

// Checking for errors in meetsJobRequirements

test("Throws an error for an unknown job in meetsJobRequirements", () => {
    assert.throws(
        () => meetsJobRequirements("nonexistent", playerLifeHigh),
        { message: "Unknown job: nonexistent" }
    );
});

// Testing calculateJobSearchHours


test("checks job search time for retail job with base statistics", () => {
    assert.ok(
        Math.abs(
            calculateJobSearchHours("retail", playerLifeLow) - 19.0476
        ) < tolerance
    );
});

test("checks job search time for the Medical Research Assistant with higher job stats", () => {
    assert.ok(
        Math.abs(
            calculateJobSearchHours("medResearchAssistant", playerLifeHigh) - 14.2857
        ) < tolerance
    );
});

test("checks job search time for retail job with no skills", () => {
    const life = {
        vitalStats: {},
        education: "High School",
        skills: {}
    };

    assert.ok(
        Math.abs(
            calculateJobSearchHours("retail", life) - 20
        ) < tolerance
    );    
});

test("checks job search time for retail job with skills at 0", () => {
    const life = {
        vitalStats: {},
        education: "High School",
        skills: {
            charisma: {level: 0},
            research: {level: 0},
            medicine: {level: 0}
        }
    };

    assert.ok(
        Math.abs(
            calculateJobSearchHours("retail", life) - 20
        ) < tolerance
    );    
});

// Checks for errors in calculateJobSearchHours

test("Throws an error for an unknown jo in calculateJobSearchHours", () => {
    const fakeJob = "newt";

    assert.throws(
        () => calculateJobSearchHours(fakeJob, playerLifeHigh),
        { message: `Unknown job: ${fakeJob}` }
    );
});

// Testing findJob



test("checksfindJob for retail", () => {
    const life = structuredClone(playerLifeLow);

    findJob("retail", life, 1);

    const job = life.job;

    assertClose(job.jobSearchProgress, 1);
    assert.equal(job.searchingFor, "retail");
    assert.equal(job.jobName, null);

});

test("checks findJob for retail, multiple iterations", () => {
    const life = structuredClone(playerLifeLow);

    findJob("retail", life, 1);
    findJob("retail", life, 1);
    findJob("retail", life, 1);

    const job = life.job;

    assertClose(job.jobSearchProgress, 3);
    assert.equal(job.searchingFor, "retail");
    assert.equal(job.jobName, null);

});

test("checks findJob for retail, should be complete", () => {
    const life = structuredClone(playerLifeLow);

    findJob("retail", life, 19);
    findJob("retail", life, 1);

    const job = life.job;

    assertClose(job.jobSearchProgress, 0);
    assert.equal(job.searchingFor, null);
    assert.equal(job.jobName, "retail");    
});

test("checks findJob for when a new job search is started, overwriting an old one", () => {
    const life = structuredClone(playerLifeHigh);


    findJob("retail", life, 10);
    const job = life.job;

    assertClose(job.jobSearchProgress, 10);
    assert.equal(job.searchingFor, "retail");
    assert.equal(job.jobName, null);    
    
    findJob("medResearchAssistant", life, 1);
    
    assertClose(job.jobSearchProgress, 1);
    assert.equal(job.searchingFor, "medResearchAssistant");
    assert.equal(job.jobName, null);      
});

test("checks findJob when the player has a job and targets it", () => {
    const life = structuredClone(playerLifeHigh);

    findJob("retail", life, 14); // should be enough to get the job
    const job = life.job;

    assertClose(job.jobSearchProgress, 0);
    assert.equal(job.searchingFor, null);
    assert.equal(job.jobName, "retail");    

    findJob("retail", life, 1);

    assertClose(job.jobSearchProgress, 0);
    assert.equal(job.searchingFor, null);
    assert.equal(job.jobName, "retail");          
});

test("checks findJob when the player doesn't qualify for medResearchAssistant", () => {
    const life = structuredClone(playerLifeLow);   
    const job = life.job;

    findJob("medResearchAssistant", life, 1);

    assertClose(job.jobSearchProgress, 0);
    assert.equal(job.searchingFor, null);
    assert.equal(job.jobName, null);              

});

test("checks findJob when the player qualifies for medResearchAssistant", () => {
    const life = structuredClone(playerLifeHigh);   
    const job = life.job;

    findJob("medResearchAssistant", life, 1);

    assertClose(job.jobSearchProgress, 1);
    assert.equal(job.searchingFor, "medResearchAssistant");
    assert.equal(job.jobName, null);        
});

test("checks findJob for medResearchAssistant when the research value is too low", () => {
    const life = {
        vitalStats: {},
        education: "Bachelor's",
        skills: {
            research: {level: 4},
            medicine: {level: 6}
        },
        job: {
            jobName: null,
            searchingFor: null,
            jobSearchProgress: 0
        }

    };

    const job = life.job;

    findJob("medResearchAssistant", life, 1);

    assertClose(job.jobSearchProgress, 0);
    assert.equal(job.searchingFor, null);
    assert.equal(job.jobName, null);        

}); 

test("checks findJob for medResearchAssistant where the skills are missing entirely", () => {
    const life = {
        vitalStats: {},
        education: "Bachelor's",
        skills: {},
        job: {
            jobName: null,
            searchingFor: null,
            jobSearchProgress: 0
        }
    };

    const job = life.job;

    findJob("medResearchAssistant", life, 1);

    assertClose(job.jobSearchProgress, 0);
    assert.equal(job.searchingFor, null);
    assert.equal(job.jobName, null);        
});

test("checks findJob for an unknown job", () => {
    const life = structuredClone(playerLifeHigh);   
    const job = life.job;
    const fakeJob = "newt";
    
    assert.throws(() => findJob(fakeJob, life, 1), 
    { message: `Unknown job: ${fakeJob}` })
});

test("checks findJob for insufficient education", () => {
    const life = {
        vitalStats: {},
        education: "High School",
        skills: {
            research: {level: 5},
            medicine: {level: 6}
        },
        job: {
            jobName: null,
            searchingFor: null,
            jobSearchProgress: 0
        }

    };
    
    const result = findJob("medResearchAssistant", life, 1);

    assertClose(life.job.jobSearchProgress, 0);
    assert.equal(life.job.searchingFor, null);
    assert.equal(life.job.jobName, null);
    assert.equal(result.hoursLeft, 1);
});

test("checks findJob for remaining hours when we hit the threshold exactly for the new job", () => {
    const life = {
        vitalStats: {},
        education: "Bachelor's",
        skills: {},
        job: {
            jobName: null,
            searchingFor: null,
            jobSearchProgress: 0
        }
    };

    const job = life.job;
    const remainingHours = findJob("retail", life, 20);    


    assertClose(remainingHours.hoursLeft, 0)
    assert.equal(job.jobName, "retail");
    assert.equal(job.searchingFor, null);  
});

test("checks findJob for remaining hours after finding a job", () => {
    const life = structuredClone(playerLifeLow);   
    const job = life.job;

    const remainingHours = findJob("retail", life, 20)

    assertClose(remainingHours.hoursLeft, 0.9524)
    assert.equal(job.jobName, "retail");
    assert.equal(job.searchingFor, null);    
});

test("checks findJob when you already have a job, and when you get a new job", () => {
    const life = structuredClone(playerLifeHigh);   
    const job = life.job;

    findJob("retail", life, 20)
    assert.equal(job.jobName, "retail");
    assert.equal(job.searchingFor, null);        

    findJob("medResearchAssistant", life, 2)
    assert.equal(job.jobName, "retail");
    assert.equal(job.searchingFor, "medResearchAssistant");        
    assertClose(job.jobSearchProgress, 2);

    findJob("medResearchAssistant", life, 40); // Should be enough for a new job
    assert.equal(job.jobName, "medResearchAssistant");
    assert.equal(job.searchingFor, null);        
    assertClose(job.jobSearchProgress, 0);    
});

test("checks findJob when passing 0 hours", () => {
    const life = structuredClone(playerLifeHigh);
    const job = life.job;

    findJob("retail", life, 20);

    let result = findJob("medResearchAssistant", life, 0);

    assert.equal(job.jobName, "retail");
    assert.equal(job.searchingFor, "medResearchAssistant");
    assertClose(job.jobSearchProgress, 0);
    assertClose(result.hoursLeft, 0);

    result = findJob("medResearchAssistant", life, 0);

    assert.equal(job.jobName, "retail");
    assert.equal(job.searchingFor, "medResearchAssistant");
    assertClose(job.jobSearchProgress, 0);
    assertClose(result.hoursLeft, 0);    
});

test("checks findJob when null is passed as the job", () => {
    const life = structuredClone(playerLifeHigh);   
    const job = life.job;

    const remainingHours = findJob(null, life, 5).hoursLeft;
    assert.equal(job.jobName, null);
    assert.equal(job.searchingFor, null);        
    assertClose(job.jobSearchProgress, 0);    
    assertClose(remainingHours, 5);
});

test("cancels a job search when qualifications are lost", () => {
    const life = structuredClone(playerLifeHigh);
    const job = life.job;

    findJob("medResearchAssistant", life, 2);

    assertClose(job.jobSearchProgress, 2);
    assert.equal(job.searchingFor, "medResearchAssistant");

    // Simulate losing a required qualification
    life.skills.research.level = 4;

    const result = findJob("medResearchAssistant", life, 1);

    assertClose(job.jobSearchProgress, 0);
    assert.equal(job.searchingFor, null);
    assert.equal(job.jobName, null);
    assertClose(result.hoursLeft, 1);
});

test("checks findJob to determine that switching back to an abandoned job search starts it over", () => {
    const life = structuredClone(playerLifeHigh);
    const job = life.job;

    findJob("retail", life, 2);    
    findJob("medResearchAssistant", life, 2);    
    const result = findJob("retail", life, 2);    

    assertClose(job.jobSearchProgress, 2);
    assert.equal(job.searchingFor, "retail");
    assert.equal(job.jobName, null);
    assertClose(result.hoursLeft, 0);    
})

test("checks findJob to ensure that unused hours are returned when a new job is acquired while already employed", () => {
    const life = structuredClone(playerLifeHigh);
    const job = life.job;
    
    findJob("retail", life, 14);    
    const result = findJob("medResearchAssistant", life, 15);

    assertClose(job.jobSearchProgress, 0);
    assert.equal(job.searchingFor, null);
    assert.equal(job.jobName, "medResearchAssistant");
    assertClose(result.hoursLeft, 0.7143);
});

test("checks findJob when null is passed during an existing search", () => {
    const life = structuredClone(playerLifeHigh);
    const job = life.job;

    findJob("retail", life, 5);

    const result = findJob(null, life, 3);

    assertClose(job.jobSearchProgress, 5);
    assert.equal(job.searchingFor, "retail");
    assert.equal(job.jobName, null);
    assertClose(result.hoursLeft, 3);
});

// Check for errors in findJOb

test("checks findJob for invalid values - negative, strings, NaN, and Infinity", () => {
    const life = structuredClone(playerLifeHigh);   
    const job = life.job;
    
    
    assert.throws(
        () => findJob("retail", life, -1),
        { message: `Invalid searchHours: -1`}
    );

    assert.throws(
        () => findJob("retail", life, "newt"),
        { message: `searchHours is not a number: newt`}
    );    

    assert.throws(
        () => findJob("retail", life, NaN),
        { message: `Invalid searchHours: NaN`}
    );        

    assert.throws(
        () => findJob("retail", life, Infinity),
        { message: `Invalid searchHours: Infinity`}
    );        

});