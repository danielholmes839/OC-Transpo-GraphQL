import { Context } from 'middleware';
import { Trip, Route, Service, StopTime } from 'api/types';

// Trip Resolvers
export default {
    route: (parent: Trip, _: void, context: Context): Promise<(Route | Error)> => {
        const { routeLoader } = context.loaders;
        return routeLoader.load(parent.route);
    },

    service: (parent: Trip, _: void, context: Context): Promise<(Service | Error)> => {
        const { serviceLoader } = context.loaders;
        return serviceLoader.load(parent.service);
    },

    stopTimes: (parent: Trip, _: void, context: Context): Promise<(StopTime | Error)[]> => {
        const { stopTimeLoader } = context.loaders;
        return stopTimeLoader.loadMany(parent.stopTimes);
    }
}