import { StopTime, Service } from 'types'

interface Checker {
    check(stopTime: StopTime): boolean
    add(stopTime: StopTime): void
}

interface DetailedChecker {
    check(stopTime: StopTime, service: Service): boolean
    add(stopTime: StopTime, service: Service): void
}

class TimeDuplicateChecker implements Checker {
    /* Check for duplicates by time only */
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
    private times: { [key: string]: Set<string> };
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
    /* 
        Checks for duplicates based on days of the week
        - duplicates are allowed if they run on different days of the week
    */
    private static cache: { [key: string]: string } = {}
    private times: { [key: number]: Set<string> };

    public constructor() {
        this.times = {};
    }

    public check(stopTime: StopTime, service: Service): boolean {
        if (this.times[stopTime.time] == null) {
            return false;
        }
        let key = this.getKey(service);
        return this.times[stopTime.time].has(key);
    }
    public add(stopTime: StopTime, service: Service): void {
        if (this.times[stopTime.time] == null) {
            this.times[stopTime.time] = new Set<string>();
        }
        this.times[stopTime.time].add(this.getKey(service));
    }

    private getKey(service: Service): string {
        if (DetailedServiceDuplicateChecker.cache[service.id] == null) {
            let key = this.createKey(service);
            DetailedServiceDuplicateChecker.cache[service.id] = key;
            return key;
        } else {
            return DetailedServiceDuplicateChecker.cache[service.id];
        }
    }
    private createKey(service: Service): string {
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

export { TimeDuplicateChecker, ServiceDuplicateChecker, DetailedServiceDuplicateChecker }