import { StopTime, Service } from '../types';
import { Context } from 'middleware'

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

const getCurrentTime = (): number => {
    let date = new Date();
    return (date.getHours() * 60) + date.getMinutes();
}

const serviceToday = (stopTime: StopTime, service: Service, today: string, tommorow: string): boolean => {
    // Service today
    return !stopTime.serviceIsNextDay && service[today]
}

const serviceTommorow = (stopTime: StopTime, service: Service, today: string, tommorow: string): boolean => {
    // Service tommorow
    return (!stopTime.serviceIsNextDay && service[tommorow]) || (stopTime.serviceIsNextDay && service[today]);
}

// Schedule Resolvers
export default {
    all: async (stopTimeIds: string[], _: void, context: Context): Promise<(StopTime | Error)[]> => {
        const { stopTimeLoader } = context.loaders;
        return await stopTimeLoader.loadMany(stopTimeIds);
    },

    next: async (stopTimeIds: string[], { limit = 1 }: Next_args, context: Context): Promise<(StopTime | Error)[]> => {
        const { stopTimeLoader, serviceLoader } = context.loaders;
        let date: Date = new Date();
        let time: number = getCurrentTime();
        let today: string = days[date.getDay()];
        let tommorow: string = days[(date.getDay() + 1) % 7];
        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));

        let index = 0
        let valid: StopTime[] = stopTimes.filter((stopTime: StopTime, i: number) => {
            let service: Service = services[i];
            if (stopTime.time >= time && serviceToday(stopTime, service, today, tommorow)) {
                index += 1;
                return true;
            } else if (stopTime.time < time && serviceTommorow(stopTime, service, today, tommorow)) {
                return true;
            }
            return false;
        })

        index += 1
        let next: StopTime[] = valid.slice(index, index + limit);
        if (next.length < limit) {
            return next.concat(valid.slice(0, limit));
        }
        return next;
    }
};