import { Context } from 'middleware'
import { StopTime, Service } from '../types';
import { stopTimeServiceToday, stopTimeServiceTomorrow, serviceRunning } from 'helpers';

type Next_args = {
    limit: number;
}

// Schedule Resolvers
export default {
    all: async (stopTimeIds: string[], _: void, context: Context): Promise<(StopTime | Error)[]> => {
        // All stop times
        const { stopTimeLoader, serviceLoader } = context.loaders;
        const { unix } = context.datetime;
        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));
        return stopTimes.filter((_, i) => serviceRunning(unix, services[i]))
    },

    allToday: async (stopTimeIds: string[], _: void, context: Context): Promise<(StopTime | Error)[]> => {
        // All stop times today
        const { stopTimeLoader, serviceLoader } = context.loaders;
        const { yesterday, today, unix } = context.datetime;
        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));
        return stopTimes.filter((stopTime, i) => {
            return stopTimeServiceToday(stopTime, services[i], today, yesterday) && serviceRunning(unix, services[i]);
        })
    },

    allTomorrow: async (stopTimeIds: string[], _: void, context: Context): Promise<(StopTime | Error)[]> => {
        // All stop times tomorow
        const { stopTimeLoader, serviceLoader } = context.loaders;
        const { today, tomorrow, unix } = context.datetime;
        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));
        return stopTimes.filter((stopTime, i) => {
            return stopTimeServiceTomorrow(stopTime, services[i], today, tomorrow) && serviceRunning(unix, services[i]);
        })
    },

    next: async (stopTimeIds: string[], { limit = 3 }: Next_args, { loaders, datetime }: Context): Promise<(StopTime | Error)[]> => {
        // Next n stop times 
        const { stopTimeLoader, serviceLoader } = loaders;
        const { yesterday, today, tomorrow, time, unix } = datetime;

        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));
        let times: Set<number> = new Set(); // duplicate times because oc transpo messes up

        let index = 0;

        let valid: StopTime[] = stopTimes.filter((stopTime: StopTime, i: number) => {
            let service: Service = services[i];
            if (!serviceRunning(unix, service)) {
                return false;
            } else if (times.has(stopTime.time)) {
                return false;
            } else if (stopTime.time >= time && stopTimeServiceToday(stopTime, service, today, yesterday)) {
                times.add(stopTime.time);
                return true;
            } else if (stopTime.time < time && stopTimeServiceTomorrow(stopTime, service, today, tomorrow)) {
                index += 1; // The index where stop times for tommorow start
                return true;
            }
            return false;
        });

        // Slice valid stop times into a list
        let next: StopTime[] = valid.slice(index, index + limit);
        if (next.length < limit) {
            return next.concat(valid.slice(0, limit - next.length));
        }
        return next;
    }
};