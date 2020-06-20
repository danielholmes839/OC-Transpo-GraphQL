import { Leg } from '../../astar/index';
import { Stop, StopRoute, Route } from '../types';
import { stopLoader, stopRouteLoader, routeLoader } from '../loaders';

// Leg Resolvers
export default {
    start: async (parent: Leg): Promise<Stop> => {
        return await stopLoader.load(parent.start);
    },

    end: async (parent: Leg): Promise<Stop> => {
        return await stopLoader.load(parent.end);
    },

    instructions: async (parent: Leg): Promise<string> => {
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

    routes: async (parent: Leg): Promise<(Route | Error)[]> => {
        if (parent.routes == null) return null;
        return routeLoader.loadMany(parent.routes);
    },

    stopRoutes: async (parent: Leg): Promise<(StopRoute | Error)[]> => {
        if (parent.routes == null) return null;
        return stopRouteLoader.loadMany(parent.routes.map(route => parent.start + route));
    }
}