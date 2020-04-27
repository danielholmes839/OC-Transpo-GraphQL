import PriorityQueue from 'ts-priority-queue';
import TravelPlan from './TravelPlan';
import { PQNode, Explored } from './types';
import { Graph, Node, Edge } from './Graph';


class Solver {
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
        console.log('solving!');
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

export default Solver;