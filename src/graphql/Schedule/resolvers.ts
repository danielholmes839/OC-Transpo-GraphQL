import { Schedule } from './types';
import { StopTime } from '../types';
import { stopTimeLoader } from '../loaders';
import { nextStopTime } from './helpers';



export default {
    all: (parent: Schedule): Promise<(StopTime | Error)[]> => {
        return stopTimeLoader.loadMany(parent.stopTimes);
    },

    next: async (parent: Schedule): Promise<StopTime> => {
        return nextStopTime(parent.stopTimes);
    }
};