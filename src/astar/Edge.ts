import { EdgeData } from './types';

class Edge {
    id: string;                   // ID of stop the edge ends at
    time: number;
    walkOnly: boolean;
    routes: Set<string>;

    public constructor(data: EdgeData) {
        this.id = data.id;
        this.time = data.time;
        this.walkOnly = data.walkOnly;
        this.routes = new Set<string>(data.routes);

    }
}

export default Edge