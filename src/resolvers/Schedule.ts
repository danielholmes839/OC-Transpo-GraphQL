import { Context } from 'middleware'
import { StopTime, Service } from 'types';
import {
    stopTimeServiceToday, stopTimeServiceTomorrow, serviceRunning,
    DetailedServiceDuplicateChecker, TimeDuplicateChecker
} from 'schedule';

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

        let checker = new DetailedServiceDuplicateChecker();

        return stopTimes.filter((stopTime, i) => {
            if (checker.check(stopTime, services[i])) {
                return false;
            } else if (serviceRunning(unix, services[i])) {
                checker.add(stopTime, services[i]);
                return true;
            } else {
                return false;
            }
        });
    },

    allToday: async (stopTimeIds: string[], _: void, context: Context): Promise<(StopTime | Error)[]> => {
        // All stop times today
        const { stopTimeLoader, serviceLoader } = context.loaders;
        const { yesterday, today, unix } = context.datetime;
        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));

        let checker = new DetailedServiceDuplicateChecker();
        return stopTimes.filter((stopTime, i) => {
            if (checker.check(stopTime, services[i])) {
                return false;
            } else if (stopTimeServiceToday(stopTime, services[i], today, yesterday) && serviceRunning(unix, services[i])) {
                checker.add(stopTime, services[i]);
                return true;
            } else {
                return false;
            }
        });
    },

    allTomorrow: async (stopTimeIds: string[], _: void, context: Context): Promise<(StopTime | Error)[]> => {
        // All stop times tomorow
        const { stopTimeLoader, serviceLoader } = context.loaders;
        const { today, tomorrow, unix } = context.datetime;
        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));

        let checker = new DetailedServiceDuplicateChecker();
        return stopTimes.filter((stopTime, i) => {
            if (checker.check(stopTime, services[i])) {
                return false;
            } else if (stopTimeServiceTomorrow(stopTime, services[i], today, tomorrow) && serviceRunning(unix, services[i])) {
                checker.add(stopTime, services[i]);
                return true;
            } else {
                return false;
            }
        });
    },

    next: async (stopTimeIds: string[], { limit = 3 }: Next_args, { loaders, datetime }: Context): Promise<(StopTime | Error)[]> => {
        // Next n stop times 
        const { stopTimeLoader, serviceLoader } = loaders;
        const { yesterday, today, tomorrow, time, unix } = datetime;

        let stopTimes: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIds);
        let services: Service[] = <Service[]>await serviceLoader.loadMany(stopTimes.map(stopTime => stopTime.service));

        let index = 0;
        let checker = new TimeDuplicateChecker();

        let valid: StopTime[] = stopTimes.filter((stopTime: StopTime, i: number) => {
            let service: Service = services[i];
            if (!serviceRunning(unix, service)) {
                // does not fall within date range
                return false;
            } else if (checker.check(stopTime)) {
                // is a duplicate
                return false;
            } else if (stopTime.time >= time && stopTimeServiceToday(stopTime, service, today, yesterday)) {
                // stop times is not a duplicate. happening today. did not already happen
                checker.add(stopTime);
                return true;
            } else if (stopTime.time < time && stopTimeServiceTomorrow(stopTime, service, today, tomorrow)) {
                // stop times are sorted. the index gets incremented meaning stop times past the index are today. before the index are stop times tommorow
                index += 1;
                checker.add(stopTime);
                return true;
            } else {
                return false;
            }
        });

        // Slice valid stop times into a list
        let next: StopTime[] = valid.slice(index, index + limit);
        if (next.length < limit) {
            return next.concat(valid.slice(0, limit - next.length));
        }
        return next;
    }
};