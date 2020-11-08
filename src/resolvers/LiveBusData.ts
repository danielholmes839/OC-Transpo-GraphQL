import { Bus } from 'octranspo';

// LiveBusData Resolvers
export default {
    nextBus: (parent: Bus[]): Bus => {
        if (parent[0]) return parent[0];
        return null;
    },
    buses: (parent: Bus[]): Bus[] => parent,
    busCount: (parent: Bus[]): number => parent.length,
    busCountGPS: (parent: Bus[]): number => {
        let count: number = 0;
        for (let bus of parent) if (bus.gps !== null) count += 1;
        return count
    }
}