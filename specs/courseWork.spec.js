const superagent = require('superagent');
require('superagent-retry-delay')(superagent);
const agent = superagent.agent();


describe.only('Test', async function() {
    it('Get all rolls', async function(numberOfRolls = 1000, dices = 1, deviation = 5) {
        let res = await agent
            .get(`https://www.random.org/integers/?num=${numberOfRolls}&min=${dices}&max=${dices*6}&col=1&base=10&format=plain&rnd=new`)
            .then((res) => {
                return res;
            })

        // Create array based on previous rolls data
        let allRolls = await res.text.split("\n")

        // Remove the last element from array
        allRolls.pop()

        // Create Map with key:value rolls
        let scoreOffRolls = new Map();

        allRolls.forEach(function(a){
            if (scoreOffRolls[a] !== undefined)
                ++scoreOffRolls[a];
            else
                scoreOffRolls[a] = 1;
        });
        console.log("scoreOffRolls ", scoreOffRolls)

        // Get of the ideal percentile
        let idealPercentile = 100/(dices*5+1)
        console.log("idealPercentile ", idealPercentile)

        // Get percentiles for each side and add it into the map
        let percentilesForEachSide = new Map();
        console.log("scoreOffRolls", scoreOffRolls[1])
        let firsSidePersentile = (scoreOffRolls[1]*100)/numberOfRolls
        console.log("firsSidePersentile", firsSidePersentile)
    });
});
