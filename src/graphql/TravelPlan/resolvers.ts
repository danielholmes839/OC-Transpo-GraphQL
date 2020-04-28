import { TravelPlan, Leg } from '../../astar/index';
import { Stop } from '../types';
import { stopLoader } from '../loaders';

export default {
    start: async (parent: TravelPlan): Promise<Stop> => {
        return await stopLoader.load(parent.start.id);
    },

    end: async (parent: TravelPlan): Promise<Stop> => {
        return await stopLoader.load(parent.end.id);
    },

    legs: (parent: TravelPlan): Leg[] => {
        console.log(parent);
        return parent.legs;
    },
}