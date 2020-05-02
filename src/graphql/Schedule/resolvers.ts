import { Schedule } from './types';
import { StopTime } from '../types';
import { stopTimeLoader } from '../loaders';
import { nextStopTimes } from './helpers';


const defaultNext: Next = {
    number: 1
}

type Next = {
    number: number;
}

export default {
    all: (parent: Schedule): Promise<(StopTime | Error)[]> => {
        return stopTimeLoader.loadMany(parent.stopTimes);
    },

    next: async (parent: Schedule, { number }: Next=defaultNext): Promise<StopTime[]> => {
        return await nextStopTimes(parent.stopTimes, number);
    }
};