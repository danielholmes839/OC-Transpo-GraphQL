import data from './data';
import Solver from './Solver';
import TravelPlan from './TravelPlan';
import { GraphData, EdgeData, NodeData } from './types';


class Edge {
    /* Class representing edges in the graph */
    public id: string;                                      // stop ID the edge ends at
    public distance: number;                                // distance in KM
    public walkOnly: boolean;                               // connects by walking
    public routes: Set<string>;                             // routes that can be taken

    public constructor(data: EdgeData) {
        /* Edge constructor */                    
        this.id = data.id;
        this.distance = data.distance;
        this.walkOnly = data.walkOnly;
        this.routes = new Set<string>(data.routes);
    }
}


class Node {
    /* Class representing edges in the graph */
    public id: string;                                      // node ID matching gtfs stop ID
    public name: string;                                    // name matching gtfs stop name
    public lat: number;                                     // latitude of stop
    public lon: number;                                     // longitude of stop
    public routes: Set<string>;                             // routes belonging to the node
    public edges: { [key: string]: Edge };                  // Edges from the node

    public constructor(data: NodeData) {
        /* Node constructor */
        this.id = data.id;
        this.name = data.name;
        this.lat = data.lat;
        this.lon = data.lon;
        this.routes = new Set<string>();
        this.edges = {}

        for (let id of Object.keys(data.edges)) {
            this.edges[id] = new Edge(data.edges[id]);
            for (let route of this.edges[id].routes) {
                this.routes.add(route);
            }
        }
    }

    public distance(other: Node): number {
        /* Calculate the distance in kilometers between nodes/stops */
        let dLat = Math.pow(this.lat - other.lat, 2);
        let dLon = Math.pow(this.lon - other.lon, 2);
        return Math.sqrt(dLat + dLon) * 111.139;
    }
}


class Graph {
    /* Graph representing the OC Transpo transit system */
    private nodes: { [key: string]: Node };                 // nodes
    public constructor(data: GraphData) {
        /* Graph constructor */
        this.nodes = {}
        for (let node of Object.keys(data)) {
            this.nodes[node] = new Node(data[node]);
        }
    }

    public getNode(node: string): Node {
        /* Get a Node by ID */
        return this.nodes[node];
    }

    public hasNode(node: string): boolean {
        /* Has a Node */
        return node in this.nodes;
    }
}

export { Graph, Node, Edge };

let graph = new Graph(data);

const createTravelPlan = (start: string, end: string): TravelPlan => {
    return new Solver(graph, start, end).solve();
}

export { createTravelPlan };
//createTravelPlan('AK151', 'CD998');
//new Solver(graph, ).solve();
//new Solver(graph, 'AK145', 'EB920').solve();
//new Solver(graph, 'AL050', 'EB920').solve();




