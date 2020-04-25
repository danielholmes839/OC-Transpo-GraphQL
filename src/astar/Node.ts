import Edge from './Edge';
import { NodeData } from './types';

class Node {
    id: string;
    name: string;
    lat: number;
    lon: number;
    routes: Set<string>;
    edges: { [key: string]: Edge };

    public constructor(data: NodeData) {
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
        let dLat = Math.pow(this.lat - other.lat, 2);
        let dLon = Math.pow(this.lon - other.lon, 2);
        return Math.sqrt(dLat + dLon) * 111.139;
    }
}

export default Node