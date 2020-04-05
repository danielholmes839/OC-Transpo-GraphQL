import { Route, Stop, StopRoute, StopTime } from '../types';
import { routeLoader, stopLoader, stopTimeLoader } from '../loaders';

export default {
    stop: (parent: StopRoute): Promise<(Stop | Error)> => {
        return stopLoader.load(parent.stop);
    },
    route: (parent: StopRoute): Promise<(Route | Error)> => {
        return routeLoader.load(parent.route);
    },
    stopTimes: (parent: StopRoute): Promise<(StopTime | Error)[]> => {
        return stopTimeLoader.loadMany(parent.stopTimes);
    }
}