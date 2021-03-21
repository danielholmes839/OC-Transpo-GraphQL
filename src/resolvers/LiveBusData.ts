import { Bus } from 'octranspo';

// LiveBusData Resolvers
export default {
    nextBus: (parent: Bus[]): Bus => {
        return (parent.length > 0) ? parent[0] : null;
    },
    buses: (parent: Bus[]): Bus[] => parent,
    busCount: (parent: Bus[]): number => parent.length,
    busCountGPS: (parent: Bus[]): number => {
        return parent.filter(bus => bus.hasPosition).length;
    }
}