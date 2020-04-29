import BusAPI from '../LiveBusData/BusAPI';
import StaticStopRouteMap from '../StaticStopRouteMap/StaticStopRouteMap';
import { Size } from '../StaticStopRouteMap/types';
import { Bus } from '../LiveBusData/Bus';
import { Route, Stop, StopRoute, StopTime, Schedule } from '../types';
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
    },
    busData: async (parent: StopRoute): Promise<Bus[]> => {
        const stop: Stop = await stopLoader.load(parent.stop);
        return BusAPI.get(stop, parent.number);
    },
    schedule: (parent: StopRoute): Schedule => {
        return { stopTimes: parent.stopTimes }
    },
    map: async (parent: StopRoute, { width = 640, height = 320, zoom=13 }: Size & {zoom: number} ): Promise<StaticStopRouteMap> => {
        const stop: Stop = await stopLoader.load(parent.stop);
        const buses: Bus[] = await BusAPI.get(stop, parent.number);
        let m = new StaticStopRouteMap(stop, buses, { width, height }, zoom)
        return m;
    }
}