import { Route, Stop, StopRoute } from '../types';
import { Context } from 'middleware';

// Stop Resolvers
export default {
    routes: (parent: Stop, _: void, context: Context): Promise<(Route | Error)[]> => {
        const { routeLoader } =  context.loaders;
        return routeLoader.loadMany(parent.routes);
    },

    stopRoutes: (parent: Stop, _: void, context: Context): Promise<(StopRoute | Error)[]> => {
        const { stopRouteLoader } =  context.loaders;
        return stopRouteLoader.loadMany(parent.stopRoutes);
    }
}