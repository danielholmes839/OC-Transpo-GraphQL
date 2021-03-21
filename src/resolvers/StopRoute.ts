import { Context } from 'middleware';
import { Route, Stop, StopRoute } from 'types';
import { Bus, API } from 'octranspo';
import { StaticStopRouteMap } from './StaticStopRouteMap';


type Size = {
    width: number,
    height: number
}

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
        return API.get(stop, parent);
    },
    schedule: (parent: StopRoute, _: void): string[] => {
        return parent.stopTimes;
    },

    map: async (parent: StopRoute, { width = 640, height = 320 }: Size, context: Context): Promise<StaticStopRouteMap> => {
        const { stopLoader } = context.loaders;
        const stop: Stop = await stopLoader.load(parent.stop);
        const buses: Bus[] = await API.get(stop, parent);

        if (buses.filter(bus => bus.hasPosition).length > 0) {
            return new StaticStopRouteMap(stop, buses, { width, height });
        }

        return null;
    }
}