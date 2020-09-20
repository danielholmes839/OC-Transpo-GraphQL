import { Context } from 'middleware'
import { StopTime, Service } from '../types';
import { stopTimeServiceToday, stopTimeServiceTomorrow } from 'helpers';

type Next_args = {
    limit: number;
}

// Schedule Resolvers
export default {
    all: async (stopTimeIds: string[], _: void, context: Context): Promise<(StopTime | Error)[]> => {
        const { stopTimeLoader } = context.loaders;
        return await stopTimeLoader.loadMany(stopTimeIds);
    },

    next: async (stopTimeIds: string[], { limit = 1 }: Next_args, { loaders, datetime }: Context): Promise<(StopTime | Error)[]> => {
        const { stopTimeLoader, serviceLoader } = loaders;
        const { yesterday, today, tommorow, currentTime } = datetime;

        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));

        let index = 0;
        let valid: StopTime[] = stopTimes.filter((stopTime: StopTime, i: number) => {
            let service: Service = services[i];
            if (stopTime.time >= currentTime && stopTimeServiceToday(stopTime, service, today, yesterday)) {
                return true;
            } else if (stopTime.time < currentTime && stopTimeServiceTomorrow(stopTime, service, today, tommorow)) {
                index += 1;
                return true;
            }
            return false;
        });

        // Slice valid stop times into a list
        let next: StopTime[] = valid.slice(index, index + limit);
        if (next.length < limit) {
            return next.concat(valid.slice(0, limit));
        }
        return next;
    }
};