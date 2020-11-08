import NodeCache from 'node-cache';
import { StopData } from './types';


class BusCache {
    private cache: NodeCache;

    public constructor() {
        /* Cache Constructor */
        this.cache = new NodeCache({ stdTTL: 30 });
    }

    public has(key: string): boolean {
        /* Key should be a stop code */
        return this.cache.has(key);
    }

    public keys(): string[] {
        /* Keys (stop codes) */
        return this.cache.keys();
    }

    public store(key: string, value: Promise<StopData>): void {
        this.cache.set(key, value);
    }

    public get(stopCode: string): Promise<StopData> {
        return this.cache.get(stopCode);
    }
}

export default BusCache