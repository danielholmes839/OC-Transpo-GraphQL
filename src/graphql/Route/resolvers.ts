import { Route, Trip, Stop } from '../types';
import { tripLoader, stopLoader } from '../loaders';

export default {
    trips: (parent: Route): Promise<(Trip | Error)[]> => {
        return tripLoader.loadMany(parent.trips);
    },
    stops: (parent: Route): Promise<(Stop | Error)[]> => {
        return stopLoader.loadMany(parent.stops);
    },
};