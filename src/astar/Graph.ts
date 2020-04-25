import PriorityQueue from 'ts-priority-queue';
import Node from './Node';
import Edge from './Edge';
import { graphData } from './data';
import { GraphData } from './types';

type PQNode = {
    id: string;             // node id
    previous: string;       // previous node id
    weight: number;         // A* priority queue weight
    time: number;       // Time taken to get to node
    walked: boolean     // This node was walked to from previous
}


class Graph {
    nodes: { [key: string]: Node };
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
    public path_limit: number;

    private explored: { [key: string]: PQNode };
    private paths_found: number;
    private distance_weight: number;
    private priorityQueue: PriorityQueue<PQNode>;

    public constructor(graph: Graph, start: string, end: string, limit: number) {
        this.graph = graph;
        this.start = graph.getNode(start);
        this.end = graph.getNode(end);

        this.paths_found = 0;
        this.path_limit = limit;

        this.explored = {}
        this.distance_weight = 10 / this.start.distance(this.end);
        console.log(this.distance_weight);
        this.priorityQueue = new PriorityQueue<PQNode>({
            comparator: (a, b): number => { return a.weight - b.weight; }
        })
        this.solve();
    }

    public calculateDelay(prev: PQNode): number {
        return
    }

    public calculateWeight(time: number, distance: number) {
        /* calculate weight for edge connecting prev ot next */
        return time + (distance * this.distance_weight);
    }

    public queueFirst(): void {
        this.priorityQueue.queue({
            id: this.start.id,
            previous: null,
            weight: 0,
            time: 0,
            walked: true
        });
    }

    public createPath(end: PQNode): Path {
        this.paths_found += 1;
        return new Path(end, this.explored, this.graph);
    }

    public solve() {
        // Set the initial node
        console.log('solving!');
        this.queueFirst();

        while (this.priorityQueue.length > 0) {
            let explore: PQNode = this.priorityQueue.dequeue();

            if (explore.id === this.end.id) {
                // Reached the end node
                this.createPath(explore);
                if (this.paths_found === this.path_limit) break;
                else continue;
            };

            this.explored[explore.id] = explore;

            let previous: Node = this.graph.getNode(explore.id);              // node to expand

            for (let id of Object.keys(previous.edges)) {
                if (id in this.explored) continue;

                let edge: Edge = previous.edges[id];                          // edge to the next node
                let next: Node = this.graph.getNode(edge.id);                    // the next node

                let delay: number = 0;
                if (edge.walkOnly && !explore.walked) delay = 10;

                let distance: number = this.end.distance(next);
                let time: number = explore.time + edge.time + delay        // in minutes

                this.priorityQueue.queue({
                    id,
                    previous: explore.id,
                    weight: this.calculateWeight(time, distance),
                    time: time,
                    walked: edge.walkOnly
                });
            }
        }
    }
}

class Path {
    constructor(end: PQNode, explored: { [key: string]: PQNode }, graph: Graph) {
        console.log('-------------------------');
        let node: PQNode = end;
        let path: PQNode[] = [];
        while (node !== null) {
            path.push(node)
            if (node.previous == null) break
            node = explored[node.previous];
        }
        path.reverse();

        for (let stop of path) console.log(stop.id, graph.getNode(stop.id).name, stop.walked, stop.weight);
    }
}

let graph = new Graph(graphData);
new Solver(graph, 'AK145', 'CD998', 1);
new Solver(graph, 'AK145', 'EB920', 1);
new Solver(graph, 'AK145', 'CD990', 1);
new Solver(graph, 'AL050', 'CD998', 1);