import fs from 'fs';

let data = JSON.parse(fs.readFileSync('./src/GRAPH.json').toString()).nodes;
export default data