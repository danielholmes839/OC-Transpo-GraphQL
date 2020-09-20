import { Context } from 'middleware'
import { StopTime, Service } from '../types';
import { stopTimeServiceToday, stopTimeServiceTommorow, getCurrentTime } from 'helpers';

type Next_args = {
    limit: number;
}

const days = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
}

// Schedule Resolvers
export default {
    all: async (stopTimeIds: string[], _: void, context: Context): Promise<(StopTime | Error)[]> => {
        const { stopTimeLoader } = context.loaders;
        return await stopTimeLoader.loadMany(stopTimeIds);
    },

    next: async (stopTimeIds: string[], { limit = 1 }: Next_args, context: Context): Promise<(StopTime | Error)[]> => {
        const { stopTimeLoader, serviceLoader } = context.loaders;
        let day: number = new Date().getDay();
        let time: number = getCurrentTime();

        // access service with service[yesterday], service[tommorow], service[tommorow],
        let yesterday: string = days[(day + 6) % 7]
        let today: string = days[day];
        let tommorow: string = days[(day + 1) % 7];

        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));

        let index = 0
        let valid: StopTime[] = stopTimes.filter((stopTime: StopTime, i: number) => {
            let service: Service = services[i];
            if (stopTime.time >= time && stopTimeServiceToday(stopTime, service, today, yesterday)) {
                return true;
            } else if (stopTime.time < time && stopTimeServiceTommorow(stopTime, service, today, tommorow)) {
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