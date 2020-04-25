import fs from 'fs';

let graphData = JSON.parse(fs.readFileSync('./src/GRAPH.json').toString()).nodes;

export {
    graphData
}