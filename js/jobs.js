export const jobs =
{
    retail: 
    {
        id: "retail",
        name: "Retail",

        requirements: {
        },

        jobSearch: {
            baseHours: 20,
            modifiers: {
                charisma: 0.05
            }
        },

        pay: 20000,      
        payPeriod: "year" 
    },
    medResearchAssistant:
    {
        id: "medResearchAssistant",
        name: "Medical Research Assistant",

        requirements:
        {
            education: "Bachelor's", 
            research: 5, 
            medicine: 5
        },

        jobSearch: {
            baseHours: 40,
            modifiers: {
                charisma: 0.05,
                medicine: 0.1,
                research: 0.1

            }
        },

        pay: 50000,
        payPeriod: "year"

    }

}

