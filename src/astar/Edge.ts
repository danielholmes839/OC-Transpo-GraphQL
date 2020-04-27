import { EdgeData } from './types';

class Edge {
    id: string;                   // ID of stop the edge ends at
    distance: number;
    walkOnly: boolean;
    routes: Set<string>;

    public constructor(data: EdgeData) {
        this.id = data.id;
        this.distance = data.distance;
        this.walkOnly = data.walkOnly;
        this.routes = new Set<string>(data.routes);
    }
}

export default Edge