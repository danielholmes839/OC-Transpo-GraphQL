import { Route, Stop, StopRoute } from '../types';
import { routeLoader, stopRouteLoader } from '../loaders';

// Stop Resolvers
export default {
    routes: (parent: Stop): Promise<(Route | Error)[]> => {
        return routeLoader.loadMany(parent.routes);
    },

    stopRoutes: (parent: Stop): Promise<(StopRoute | Error)[]> => {
        return stopRouteLoader.loadMany(parent.stopRoutes);
    },

    code: (parent: Stop) => {
        return parent.code.substring(0, parent.code.length - 2);
    }
}