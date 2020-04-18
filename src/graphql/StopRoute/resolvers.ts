import { Route, Stop, StopRoute, StopTime } from '../types';
import { routeLoader, stopLoader, stopTimeLoader } from '../loaders';
import { Bus } from '../LiveBusData/Bus';
import BusAPI from '../LiveBusData/API';
import StaticStopRouteMap from '../StaticStopRouteMap/StaticStopRouteMap';

export default {
    stop: (parent: StopRoute): Promise<(Stop | Error)> => {
        return stopLoader.load(parent.stop);
    },
    route: (parent: StopRoute): Promise<(Route | Error)> => {
        return routeLoader.load(parent.route);
    },
    stopTimes: (parent: StopRoute): Promise<(StopTime | Error)[]> => {
        return stopTimeLoader.loadMany(parent.stopTimes);
    },
    busData: async (parent: StopRoute): Promise<Bus[]> => {
        const stop: Stop = await stopLoader.load(parent.stop);
        return BusAPI.get(stop, parent.number);
    },
    map: async (parent: StopRoute): Promise<StaticStopRouteMap> => {
        const stop: Stop = await stopLoader.load(parent.stop);
        const buses: Bus[] = await BusAPI.get(stop, parent.number);
        let m = new StaticStopRouteMap(stop, buses, {width: 600, height: 400})
        return m;
    }
}