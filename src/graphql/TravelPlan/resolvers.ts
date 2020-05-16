import { TravelPlan, Leg } from '../../astar/index';
import { Stop } from '../types';
import { stopLoader } from '../loaders';
import { Size } from '../Maps/types';
import StaticTravelPlanMap from '../Maps/StaticTravelPlanMap';


export default {
    start: async (parent: TravelPlan): Promise<Stop> => {
        return await stopLoader.load(parent.start.id);
    },

    end: async (parent: TravelPlan): Promise<Stop> => {
        return await stopLoader.load(parent.end.id);
    },

    legs: (parent: TravelPlan): Leg[] => {
        return parent.legs;
    },
    map: async (parent: TravelPlan, { width = 640, height = 320, zoom = 13 }: Size & { zoom: number }): Promise<StaticTravelPlanMap> => {
        return new StaticTravelPlanMap(await parent.stops(), { width, height }, zoom)
    }
}