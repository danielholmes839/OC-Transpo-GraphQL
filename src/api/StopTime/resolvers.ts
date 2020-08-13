import { Context } from 'middleware';
import { StopTime, Trip, Stop, Route, StopRoute, Service } from 'api/types';

// StopTime Resolvers
export default {
    trip: (parent: StopTime, _: void, context: Context): Promise<(Trip | Error)> => {
        const { tripLoader } = context.loaders;
        return tripLoader.load(parent.trip);
    },

    stop: (parent: StopTime, _: void, context: Context): Promise<(Stop | Error)> => {
        const { stopLoader } = context.loaders;
        return stopLoader.load(parent.stop);
    },

    route: (parent: StopTime, _: void, context: Context): Promise<(Route | Error)> => {
        const { routeLoader } = context.loaders;
        return routeLoader.load(parent.route);
    },

    stopRoute: (parent: StopTime, _: void, context: Context): Promise<(StopRoute | Error)> => {
        const { stopRouteLoader } = context.loaders;
        return stopRouteLoader.load(parent.stopRoute);
    },

    service: (parent: StopTime, _: void, context: Context): Promise<(Service | Error)> => {
        const { serviceLoader } = context.loaders;
        return serviceLoader.load(parent.service);
    }
}