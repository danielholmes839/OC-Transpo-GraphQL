import { StopTime, Trip, Stop, Service } from '../types';
import { tripLoader, stopLoader, serviceLoader } from '../loaders';

// StopTime Resolvers
export default {
    trip: (parent: StopTime): Promise<(Trip | Error)> => {
        return tripLoader.load(parent.trip);
    },

    stop: (parent: StopTime): Promise<(Stop | Error)> => {
        return stopLoader.load(parent.stop);
    },

    service: (parent: StopTime): Promise<(Service | Error)> => {
        return serviceLoader.load(parent.service);
    }
}