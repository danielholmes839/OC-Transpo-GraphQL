import { Context } from 'middleware';
import { StopTime, Trip, Stop, Service } from 'api/types';

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

    service: (parent: StopTime, _: void, context: Context): Promise<(Service | Error)> => {
        const { serviceLoader } = context.loaders;
        return serviceLoader.load(parent.service);
    }
}