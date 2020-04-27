import { Graph, Node, Edge } from './Graph';
import { PQNode, Leg, Explored } from './types';


class TravelPlan {
    public start: Node;
    public end: Node;
    public path: Node[];
    public legs: Leg[];
    public distance: number;

    public constructor(end: PQNode, explored: Explored, graph: Graph) {
        console.log('-------------------------');
        this.distance = end.distance;
        this.end = graph.getNode(end.id)
        this.createPath(end, explored, graph);
        //this.logPath();
        this.addLegs(explored);
        console.log(this.legs);

    }

    public addLegs(explored: Explored): void {
        this.legs = [];
        let routes = this.path[0].edges[this.path[1].id].routes;
        let start = this.start                                          // start of leg

        for (let i = 0; i < this.path.length - 1; i++) {
            let current: Node = this.path[i];
            let next: Node = this.path[i + 1]
            let edge: Edge = current.edges[next.id];

            if (next.id === this.end.id) {
                let distance = explored[current.id].distance + edge.distance - explored[start.id].distance;
                if (edge.walkOnly) this.addLeg(start, next, null, distance, true);
                else this.addLeg(start, next, Array.from(routes), distance, false);

                //if (edge.walkOnly) console.log(`walk from ${start.name} to ${next.name}`);
                //else console.log(`take ${routes.values().next().value} from ${start.name} to ${next.name}`);
                break;
            }

            if (edge.walkOnly) {
                let distance = explored[next.id].distance - explored[start.id].distance;
                this.addLeg(start, next, null, distance, true);
                //console.log(`walk from ${start.name} to ${next.name}`);
                routes = next.routes;
                start = next;
                continue;
            }

            //console.log(i, routes);
            let routes_to_next = new Set<string>(routes);
            for (let route of routes) if (!edge.routes.has(route)) {
                routes.delete(route);
                if (routes.size === 0) {
                    //console.log(routes_to_next)
                    //console.log(`take ${route} from ${start.name} to ${next.name}`);
                    let distance = explored[next.id].distance - explored[start.id].distance;
                    this.addLeg(start, next, Array.from(routes_to_next), distance, false);
                    start = next;
                    routes = next.routes;
                }
            }
        }
    }

    public addLeg(start: Node, end: Node, routes: string[], distance: number, walk: boolean): void {
        this.legs.push({
            start: start.id,
            end: end.id,
            routes: routes,
            distance: distance,
            walk: walk
        });
    }

    public createPath(end: PQNode, explored: { [key: string]: PQNode }, graph: Graph): void {
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

    public logPath(): void {
        for (let i = 0; i < this.path.length; i++) {
            let stop = this.path[i];
            console.log(i, stop.id, stop.name);
        }
    }
}

export default TravelPlan;