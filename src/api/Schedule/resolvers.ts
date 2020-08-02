import { Schedule } from './types';
import { StopTime } from '../types';
import { nextStopTimes } from './helpers';
import { Context } from 'middleware'

type Next_args = {
    number: number;
}

// Schedule Resolvers
export default {
    all: (parent: Schedule, _: void, context: Context): Promise<(StopTime | Error)[]> => {
        const { stopTimeLoader } = context.loaders;
        return stopTimeLoader.loadMany(parent.stopTimes);
    },

    next: async (parent: Schedule, { number }: Next_args = { number: 1 }, context: Context): Promise<StopTime[]> => {
        const { serviceLoader } = context.loaders;
        return await nextStopTimes(parent.stopTimes, number, serviceLoader);
    }
};