
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

export {
    GraphData, NodeData, EdgeData
}