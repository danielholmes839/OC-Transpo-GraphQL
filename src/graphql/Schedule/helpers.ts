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

const nextStopTime = async (stopTimeIDs: string[]): Promise<StopTime> =>  {
    let stopTimes = <StopTime[]> await stopTimeLoader.loadMany(stopTimeIDs);
    let trips = <Trip[]> await tripLoader.loadMany(stopTimes.map(stopTime => stopTime.trip));
    let services = <Service[]> await serviceLoader.loadMany(trips.map(trip => trip.service));

    let date = new Date();
    let day = days[date.getDay()];
    let time = date.getHours() * 60 + date.getMinutes();

    let stopTime: StopTime;
    let service: Service

    for (let i=0; i<stopTimes.length; i++) {
        stopTime = stopTimes[i];
        if (time < stopTime.time.int) {
            service = services[i]
            if (service[day]) return stopTime;
        }
    }
    return null
}

export { nextStopTime }
