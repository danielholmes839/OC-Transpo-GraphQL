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
        let ids: string[] = [parent.legs[0].start];
        for (let leg of parent.legs) ids.push(leg.end);
        let stops: Stop[] = <Stop[]>await stopLoader.loadMany(ids);
        return new StaticTravelPlanMap(stops, { width, height }, zoom)
    }
}