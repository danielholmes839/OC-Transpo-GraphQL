import { Trip, Route, Service, StopTime} from '../types';
import { routeLoader, serviceLoader, stopTimeLoader } from '../loaders';

export default {
    route: (parent: Trip): Promise<(Route | Error)> => {
        return routeLoader.load(parent.route);
    },

    service: (parent: Trip): Promise<(Service | Error)> => {
        return serviceLoader.load(parent.service);
    },

    stopTimes: (parent: Trip): Promise<(StopTime | Error)[]> => {
        return stopTimeLoader.loadMany(parent.stopTimes);
    }
}