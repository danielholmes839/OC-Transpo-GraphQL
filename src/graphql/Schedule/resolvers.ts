import { Schedule } from './types';
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

export default {
    all: (parent: Schedule): Promise<(StopTime | Error)[]> => {
        return stopTimeLoader.loadMany(parent.stopTimes);
    },

    next: async (parent: Schedule): Promise<StopTime | Error> => {
        let stopTimes: (StopTime | Error)[] = await stopTimeLoader.loadMany(parent.stopTimes);
        let date = new Date();
        let day = days[date.getDay()];
        let time = date.getHours() * 60 + date.getMinutes();

        for (let stopTime of stopTimes) {
            if (stopTime instanceof Error) throw stopTime;
            if (time < stopTime.time.int) {
                let trip: Trip = await tripLoader.load(stopTime.trip);
                let service: Service = await serviceLoader.load(trip.service);
                if (service[day]) {
                    return stopTime;
                }
            }
        }
        return null
    }
};