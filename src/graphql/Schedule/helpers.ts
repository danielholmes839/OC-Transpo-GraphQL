import { StopTime, Service, Trip } from '../types';
import { stopTimeLoader, serviceLoader, tripLoader } from '../loaders';


const days = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
}

const currentTime = (): number => {
    return
}

const currentDay = (): string => {
    return
}

const nextStopTime = async (stopTimeIDs: string[]): Promise<StopTime> => {
    let stopTimes = <StopTime[]>await stopTimeLoader.loadMany(stopTimeIDs);
    let trips = <Trip[]>await tripLoader.loadMany(stopTimes.map(stopTime => stopTime.trip));
    let services = <Service[]>await serviceLoader.loadMany(trips.map(trip => trip.service));
    let date = new Date();
    let day = days[date.getDay()];
    let time = date.getHours() * 60 + date.getMinutes();

    let stopTime: StopTime;
    let service: Service

    // Binary Search for start position
    // There can be hundreds of stop times so its worth it to do a binary search
    let start = 0;
    let end = stopTimes.length - 1;
    let middle = Math.floor((start + end) / 2);

    while (start != end - 1) {
        if (time > stopTimes[middle].time.int) start = middle;
        else end = middle;
        middle = Math.floor((start + end) / 2);
    }

    // Then find the next valid StopTime with service on the day
    for (let i = end; i < stopTimes.length; i++) {
        stopTime = stopTimes[i];
        if (time < stopTime.time.int) {
            service = services[i]
            if (service[day]) return stopTime;
        }
    }
    return null
}

export { nextStopTime }
