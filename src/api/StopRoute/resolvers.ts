import { Context } from 'middleware';
import { Route, Stop, StopRoute, Schedule } from 'api/types';
import StaticStopRouteMap from 'api/Maps/StaticStopRouteMap';
import { Size } from 'api/Maps/types';
import BusAPI from 'api/LiveBusData/BusAPI';
import { Bus } from 'api/LiveBusData/Bus';


// StopRoute Resolvers
export default {
    stop: (parent: StopRoute, _: void, context: Context): Promise<(Stop | Error)> => {
        const { stopLoader } = context.loaders;
        return stopLoader.load(parent.stop);
    },
    route: (parent: StopRoute, _: void, context: Context): Promise<(Route | Error)> => {
        const { routeLoader } = context.loaders;
        return routeLoader.load(parent.route);
    },
    liveBusData: async (parent: StopRoute, _: void, context: Context): Promise<Bus[]> => {
        const { stopLoader } = context.loaders;
        const stop: Stop = await stopLoader.load(parent.stop);
        return BusAPI.get(stop, parent.number);
    },
    schedule: (parent: StopRoute, _: void, context: Context): Schedule => {
        return { stopTimes: parent.stopTimes }
    },

    map: async (parent: StopRoute, { width = 640, height = 320 }: Size, context: Context): Promise<StaticStopRouteMap> => {
        const { stopLoader } = context.loaders;
        const stop: Stop = await stopLoader.load(parent.stop);
        const buses: Bus[] = await BusAPI.get(stop, parent.number);

        for (let bus of buses) {
            // There needs to be atleast one bus with GPS to make a map
            if (bus.gps !== null) {
                return new StaticStopRouteMap(stop, buses, { width, height });
            }
        }

        return null;
    }
}