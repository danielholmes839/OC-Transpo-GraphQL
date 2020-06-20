import { Schedule } from './types';
import { StopTime } from '../types';
import { stopTimeLoader } from '../loaders';
import { nextStopTimes } from './helpers';

type Next = {
    number: number;
}

// Schedule Resolvers
export default {
    all: (parent: Schedule): Promise<(StopTime | Error)[]> => {
        return stopTimeLoader.loadMany(parent.stopTimes);
    },

    next: async (parent: Schedule, { number }: Next={ number: 1 }): Promise<StopTime[]> => {
        return await nextStopTimes(parent.stopTimes, number);
    }
};