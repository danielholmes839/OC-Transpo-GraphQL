import { StopTime, Trip, Stop, Route } from '../types';
import { tripLoader, stopLoader, routeLoader } from '../loaders';

export default {
    trip: (parent: StopTime): Promise<(Trip | Error)> => {
        return tripLoader.load(parent.trip);
    },

    stop: (parent: StopTime): Promise<(Stop | Error)> => {
        return stopLoader.load(parent.stop);
    }
}