import { performance } from 'perf_hooks';
import PriorityQueue from 'ts-priority-queue';
import Node from './Node';
import Edge from './Edge';
import { graphData } from './data';
import { GraphData } from './types';

type PQNode = {
    id: string;             // node id
    previous: string;       // previous node id
    weight: number;         // A* priority queue weight
    distance: number;       // Distance travelled to get to the node
    walked: boolean         // This node was walked to from previous
}


class Graph {
    private nodes: { [key: string]: Node };
    public constructor(data: GraphData) {
        this.nodes = {}
        for (let node of Object.keys(data)) {
            this.nodes[node] = new Node(data[node]);
        }
    }

    public getNode(node: string): Node {
        return this.nodes[node];
    }

    public hasNode(node: string): boolean {
        return node in this.nodes;
    }
}


class Solver {
    public graph: Graph;
    public start: Node;
    public end: Node;

    private delay: number;
    private explored: { [key: string]: PQNode };
    private priorityQueue: PriorityQueue<PQNode>;

    public constructor(graph: Graph, start: string, end: string) {
        this.graph = graph;
        this.explored = {}
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
        console.log('solving!');
        this.createQueue();

        while (this.priorityQueue.length > 0) {
            let explore: PQNode = this.priorityQueue.dequeue();
            if (explore.id === this.end.id) return new Path(explore, this.explored, this.graph);
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


interface Leg {
    start: string;
    end: string;

    route: string;
    stopRoute: string;

}

class Path {
    public path: Node[];
    public legs: Leg[];
    constructor(end: PQNode, explored: { [key: string]: PQNode }, graph: Graph) {
        console.log('-------------------------');
        let node: PQNode = end;
        let pq: PQNode[] = []
        let path: Node[] = [];
        while (node !== null) {
            pq.push(node);
            path.push(graph.getNode(node.id));
            if (node.previous == null) break
            node = explored[node.previous];
        }
        path.reverse();
        for (let i = 0; i < path.length; i++) {
            let stop = path[i];
            console.log(i, stop.id, stop.name, pq[i].walked);
        }

        let count = 0;
        let routes = path[0].edges[path[1].id].routes;
        let start = path[0]

        for (let i = count; i < path.length - 1; i++) {
            let current: Node = path[i];
            let next: Node = path[i + 1]
            let edge: Edge = current.edges[next.id];

            if (next.id === end.id) {
                if (edge.walkOnly) console.log(`walk from ${current.name} to ${next.name}`);
                else console.log(`take ${routes.values().next().value} from ${start.name} to ${next.name}`);
                break;
            }

            if (edge.walkOnly) {
                console.log(`walk from ${current.name} to ${next.name}`);
                routes = next.routes;
                start = next;
                continue;
            }

            //console.log(i, routes);

            for (let route of routes) if (!edge.routes.has(route)) {
                routes.delete(route);

                if (routes.size === 0) {
                    console.log(`take ${route} from ${start.name} to ${next.name}`);
                    start = next;
                    routes = next.routes;
                }
            }
        }
    }
}

let graph = new Graph(graphData);
new Solver(graph, 'AK151', 'CD998').solve();
new Solver(graph, 'AK145', 'EB920').solve();
new Solver(graph, 'AL050', 'EB920').solve();