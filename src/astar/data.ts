import fs from 'fs';

type GraphData = { [key: string]: NodeData }

type NodeData = {
    id: string;
    name: string;
    lat: number;
    lon: number;
    edges: { [key: string]: EdgeData };
}

type EdgeData = {
    id: string;
    distance: number;
    walkOnly: boolean;
    routes: string[];
}

let data: GraphData = JSON.parse(fs.readFileSync('./src/astar/GRAPH.json').toString()).nodes;

export { data, GraphData, NodeData, EdgeData };