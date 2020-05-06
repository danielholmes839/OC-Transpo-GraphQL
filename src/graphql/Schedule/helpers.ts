import { performance } from 'perf_hooks';

import { StopTime, Service, Trip } from '../types';
import { StopTimeCollection } from '../collections';
import { stopTimeLoader, serviceLoader, tripLoader, stopLoader } from '../loaders';


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
    let date = new Date();
    return date.getHours() * 60 + date.getMinutes();
}

const currentDay = (): string => {
    let date = new Date();
    return days[date.getDay()];
}

const nextStopTimes = async (stopTimeIDs: string[], find: number = 1): Promise<StopTime[]> => {
    let day = currentDay();
    let time = currentTime();

    // Query stop times
    let stopTimes = await StopTimeCollection.find({
        'time': { $gt: time },
        _id: { $in: stopTimeIDs },
    }).sort({ 'time': 1 }).limit(find * 5);
    if (stopTimes.length === 0) return [];

    // Load trips and service to check if the stoptime is avaible on this day
    // Should be able to do this with a $lookup query but not quire sure how yet
    let trips = <Trip[]>await tripLoader.loadMany(stopTimes.map(stopTime => stopTime.trip));
    let services = <Service[]>await serviceLoader.loadMany(trips.map(trip => trip.service));

    // Check service
    let stopTime: StopTime;
    let service: Service;
    let duplicates = new Set<number>();
    let found: StopTime[] = [];

    for (let i = 0; i < stopTimes.length && found.length < find; i++) {
        stopTime = stopTimes[i];
        if (time < stopTime.time && !duplicates.has(stopTime.time)) {
            service = services[i]
            if (service[day]) {
                duplicates.add(stopTime.time);
                found.push(stopTime);
            }
        }
    }
    return found
}

export { currentTime, currentDay, nextStopTimes }
