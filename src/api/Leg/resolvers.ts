/* Leg Resolvers */
import { Context } from 'middleware';
import { Leg } from 'astar';
import { Stop, StopRoute, Route } from 'api/types';

export default {
    start: async (parent: Leg, _: void, context: Context): Promise<Stop> => {
        const { stopLoader } = context.loaders;
        return await stopLoader.load(parent.start);
    },

    end: async (parent: Leg, _: void, context: Context): Promise<Stop> => {
        const { stopLoader } = context.loaders;
        return await stopLoader.load(parent.end);
    },

    instructions: async (parent: Leg, _: void, context: Context): Promise<string> => {
        const { stopLoader, stopRouteLoader } = context.loaders;
        let start = await stopLoader.load(parent.start);
        let end = await stopLoader.load(parent.end);

        if (parent.walk) {
            // Walking between stops
            return `Walk from ${start.name} to ${end.name}`;
        } else {
            // Taking a bus
            let stopRoute: StopRoute = await stopRouteLoader.load(start.id + parent.routes[0]);
            return `Take the ${stopRoute.number} ${stopRoute.headsign} from ${start.name} to ${end.name}`;
        }
    },

    routes: async (parent: Leg, _: void, context: Context): Promise<(Route | Error)[]> => {
        const { routeLoader } = context.loaders;
        if (parent.routes == null) return null;
        return routeLoader.loadMany(parent.routes);
    },

    stopRoutes: async (parent: Leg, _: void, context: Context): Promise<(StopRoute | Error)[]> => {
        const { stopRouteLoader } = context.loaders;
        if (parent.routes == null) return null;
        return stopRouteLoader.loadMany(parent.routes.map(route => parent.start + route));
    }
}