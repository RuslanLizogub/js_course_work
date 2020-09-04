const superagent = require('superagent');
require('superagent-retry-delay')(superagent);
const agent = superagent.agent();

describe.only('Test', async function() {
    it('Get all rolls', async function(numberOfRolls = process.env.ROLLS || 1000, dices = process.env.DICES || 1, deviation = process.env.DEVIATION || 5) {
        let res = await agent
            .get(`https://www.random.org/integers/?num=${numberOfRolls}&min=${dices}&max=${dices*6}&col=1&base=10&format=plain&rnd=new`)
            .then((res) => {
                return res;
            });

        // Create array based on previous rolls data
        let allRolls = await res.text.split("\n");

        // Remove the last element from array
        allRolls.pop();

        // Create Map with key:value rolls
        let scoreOffRolls = new Map();

        allRolls.forEach(function(a){
            if (scoreOffRolls[a] !== undefined)
                ++scoreOffRolls[a];
            else
                scoreOffRolls[a] = 1;
        });

        // Get of the ideal percentile
        let idealPercentile = 100/(dices*5+1);

        // Get percentiles for each side and add it into the map
        let percentilesForEachSide = new Map();
        for (let key in scoreOffRolls){
            percentilesForEachSide[key] = (scoreOffRolls[key]*100)/numberOfRolls;
        }

        //Check that deviation is correct
        let minimumDeviation = idealPercentile - deviation/2;
        let maximumDeviation = idealPercentile + deviation/2;
        for (let key in percentilesForEachSide){
            if(percentilesForEachSide[key] <= maximumDeviation && percentilesForEachSide[key] >= minimumDeviation){
                console.log(`For value ${key} Result is PASS!`)
            } else {
                console.log(`For value ${key} Result is FALSE!`)
            }
        }
    });
});
