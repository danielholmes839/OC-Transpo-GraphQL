import { Context } from 'middleware';
import { TravelPlan, Leg } from 'astar';
import { Stop } from 'api/types';
import { Size } from 'api/Maps/types';
import StaticTravelPlanMap from 'api/Maps/StaticTravelPlanMap';

// Travel Plan Resolvers
export default {
    start: async (parent: TravelPlan, _: void, context: Context): Promise<Stop> => {
        const { stopLoader } = context.loaders;
        return await stopLoader.load(parent.start.id);
    },

    end: async (parent: TravelPlan, _: void, context: Context): Promise<Stop> => {
        const { stopLoader } = context.loaders;
        return await stopLoader.load(parent.end.id);
    },

    legs: (parent: TravelPlan, _: void): Leg[] => {
        return parent.legs;
    },
    map: async (parent: TravelPlan, { width = 640, height = 320, zoom = 13 }: Size & { zoom: number }): Promise<StaticTravelPlanMap> => {
        return new StaticTravelPlanMap(await parent.stops(), { width, height }, zoom)
    }
}