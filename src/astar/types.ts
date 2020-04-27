
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

type Explored = { [key: string]: PQNode }

type Leg = {
    start: string;
    end: string;
    routes: string[];
    distance: number;
    walk: boolean;
}

type PQNode = {
    id: string;             // node id
    previous: string;       // previous node id
    weight: number;         // A* priority queue weight
    distance: number;       // Distance travelled to get to the node
    walked: boolean         // This node was walked to from previous
}

export {
    GraphData, NodeData, EdgeData, Leg, PQNode, Explored
}