import { Context } from 'middleware'
import { StopTime, Service } from 'types';
import { stopTimeServiceToday, stopTimeServiceTomorrow, serviceRunning } from 'helpers';

type Next_args = {
    limit: number;
}

interface Checker {
    check(stopTime: StopTime): boolean
    add(stopTime: StopTime): void
}

interface DetailedChecker {
    check(stopTime: StopTime, service: Service): boolean
    add(stopTime: StopTime, service: Service): void
}

class TimeDuplicateChecker implements Checker {
    private times: Set<number>;

    constructor() {
        this.times = new Set<number>();
    }

    public check(stopTime: StopTime) {
        return this.times.has(stopTime.time);
    }

    public add(stopTime: StopTime) {
        this.times.add(stopTime.time);
    }
}

class ServiceDuplicateChecker implements Checker {
    private times: { [key: number]: Set<string> };
    constructor() {
        this.times = {};
    }

    public check(stopTime: StopTime): boolean {
        // true if duplicate
        if (this.times[stopTime.time] == null) {
            return false;
        } else if (this.times[stopTime.time].has(stopTime.service)) {
            return true;
        } else {
            return false;
        }
    }

    public add(stopTime: StopTime): void {
        if (this.times[stopTime.time] == null) {
            this.times[stopTime.time] = new Set<string>(stopTime.service);
        } else {
            this.times[stopTime.time].add(stopTime.service);
        }
    }
}

class DetailedServiceDuplicateChecker implements DetailedChecker {
    private static cache: { [key: string]: string } = {}
    private times: { [key: number]: Set<string> };

    public constructor() {
        this.times = {};
    }

    public check(stopTime: StopTime, service: Service): boolean {
        if (this.times[stopTime.time] == null) {
            return false;
        }
        let key = this.get_key(service);
        return this.times[stopTime.time].has(key);
    }
    public add(stopTime: StopTime, service: Service): void {
        if (this.times[stopTime.time] == null) {
            this.times[stopTime.time] = new Set<string>();
        }
        this.times[stopTime.time].add(this.get_key(service));
    }

    public get_key(service: Service): string {
        if (DetailedServiceDuplicateChecker.cache[service.id] == null) {
            let key = this.create_key(service);
            DetailedServiceDuplicateChecker.cache[service.id] = key;
            return key;
        } else {
            return DetailedServiceDuplicateChecker.cache[service.id];
        }
    }
    public create_key(service: Service): string {
        // key to identify the days a service is running
        return [
            service.monday ? 1 : 0,
            service.tuesday ? 1 : 0,
            service.wednesday ? 1 : 0,
            service.thursday ? 1 : 0,
            service.friday ? 1 : 0,
            service.saturday ? 1 : 0,
            service.sunday ? 1 : 0
        ].join("");
    }
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