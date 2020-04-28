import PriorityQueue from 'ts-priority-queue';
import { GraphData, NodeData, EdgeData, data } from './data';


type Explored = { [key: string]: PQNode }

type PQNode = {
    id: string;             // node id
    previous: string;       // previous node id
    weight: number;         // A* priority queue weight
    distance: number;       // Distance travelled to get to the node
    walked: boolean         // This node was walked to from previous
}

type Leg = {
    start: string;
    end: string;
    routes: string[];
    distance: number;
    walk: boolean;
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

class TravelPlan {
    public start: Node;
    public end: Node;
    public path: Node[];
    public legs: Leg[];
    public distance: number;

    public constructor(end: PQNode, explored: Explored, graph: Graph) {
        //console.log('-------------------------');
        this.distance = end.distance;
        this.end = graph.getNode(end.id)
        this.createPath(end, explored, graph);
        //this.logPath();
        this.addLegs(explored);
        //console.log(this.legs);
    }

    private addLegs(explored: Explored): void {
        this.legs = [];
        let routes = new Set<string>(this.path[0].edges[this.path[1].id].routes);
        let start = this.start;

        for (let i = 0; i < this.path.length - 1; i++) {
            let current: Node = this.path[i];
            let next: Node = this.path[i + 1]
            let edge: Edge = current.edges[next.id];

            if (next.id === this.end.id) {
                let distance = explored[current.id].distance + edge.distance - explored[start.id].distance;
                if (edge.walkOnly) {
                    this.addLeg(start, next, null, distance, true);
                } else {
                    this.addLeg(start, next, Array.from(routes), distance, false);
                }
                //if (edge.walkOnly) console.log(`walk from ${start.name} to ${next.name}`);
                //else console.log(`take ${routes.values().next().value} from ${start.name} to ${next.name}`);
                break;
            }

            if (edge.walkOnly) {
                let distance = explored[next.id].distance - explored[start.id].distance;
                this.addLeg(start, next, null, distance, true);
                //console.log(`walk from ${start.name} to ${next.name}`);
                routes = new Set<string>(next.routes);
                start = next;
                continue;
            }

            //console.log(i, routes);
            //let routes_to_next = new Set<string>(routes);
            for (let route of routes) if (!edge.routes.has(route)) {
                routes.delete(route);
                if (routes.size === 0) {
                    //console.log(routes_to_next)
                    //console.log(`take ${route} from ${start.name} to ${next.name}`);
                    let distance = explored[next.id].distance - explored[start.id].distance;
                    this.addLeg(start, next, [route], distance, false);

                    routes = new Set<string>(next.routes);
                    start = next;
                }
            }
        }
    }

    private addLeg(start: Node, end: Node, routes: string[], distance: number, walk: boolean): void {
        this.legs.push({
            start: start.id,
            end: end.id,
            routes: routes,
            distance: distance,
            walk: walk
        });
    }

    private createPath(end: PQNode, explored: { [key: string]: PQNode }, graph: Graph): void {
        this.path = [];
        let node: PQNode = end;
        while (node !== null) {
            this.path.push(graph.getNode(node.id));
            if (node.previous == null) {
                this.start = graph.getNode(node.id);
                break;
            }
            node = explored[node.previous];
        }
        this.path.reverse();
    }

    private logPath(): void {
        for (let i = 0; i < this.path.length; i++) {
            let stop = this.path[i];
            console.log(i, stop.id, stop.name);
        }
    }


}


class Solver {
    /* A* Algorithm */
    public graph: Graph;
    public start: Node;
    public end: Node;

    private delay: number;
    private explored: Explored;
    private priorityQueue: PriorityQueue<PQNode>;

    public constructor(graph: Graph, start: string, end: string) {
        this.graph = graph;
        this.explored = {};
        this.start = graph.getNode(start);
        this.end = graph.getNode(end);
        this.delay = 1;
    }

    private createQueue(): void {
        this.priorityQueue = new PriorityQueue<PQNode>({
            comparator: (a, b): number => a.weight - b.weight
        });

        this.priorityQueue.queue({
            id: this.start.id,
            previous: null,
            weight: 0,
            distance: 0,
            walked: false
        });
    }

    private calculateDelay(previousEdge: Edge, nextEdge: Edge): number {
        if (nextEdge.id === this.end.id) return 0;
        for (let route of previousEdge.routes) {
            if (nextEdge.routes.has(route)) {
                return 0;
            }
        }
        return this.delay;
    }

    public solve() {
        // Set the initial node
        this.createQueue();

        while (this.priorityQueue.length > 0) {
            let explore: PQNode = this.priorityQueue.dequeue();
            if (explore.id === this.end.id) return new TravelPlan(explore, this.explored, this.graph);
            this.explored[explore.id] = explore;

            let previous: Node = this.graph.getNode(explore.id);              // node to expand

            for (let id of Object.keys(previous.edges)) {
                if (id in this.explored) continue;
                let edge: Edge = previous.edges[id];                          // edge to the next node
                let next: Node = this.graph.getNode(edge.id);                 // the next node

                let delay: number = this.calculateDelay(previous.edges[id], edge);
                let distance = explore.distance + edge.distance;
                let weight: number = distance + delay + this.end.distance(next) * 0.8;

                this.priorityQueue.queue({
                    id,
                    previous: explore.id,
                    weight: weight,
                    distance: distance,
                    walked: edge.walkOnly
                });
            }
        }
    }
}


let graph: Graph = new Graph(data);
const plan = (start: string, end: string): TravelPlan => {
    return new Solver(graph, start, end).solve();
}

export { plan, TravelPlan, Leg }