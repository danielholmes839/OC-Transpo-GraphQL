import { Bus } from './bus';

export default {
    nextBus: (parent: Bus[]): Bus => {
        if (parent[0]) return parent[0];
        return null;
    },
    buses: (parent: Bus[]): Bus[] => parent,
    busCount: (parent: Bus[]): number => parent.length
}