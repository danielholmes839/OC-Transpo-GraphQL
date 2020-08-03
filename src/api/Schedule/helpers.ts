import DataLoader from 'dataloader';
import { StopTime, Service } from 'api/types';
import { Context } from 'middleware';

type AccurateStopTime = {
    id: string;
    time: number;
}

const midnight = 24 * 60;

const days = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
}

const accurate = (stop_time: StopTime): AccurateStopTime => {
    return {
        id: stop_time.id,
        time: stop_time.time % midnight
    }
}

const zip = <T1, T2>(a: T1[], b: T2[]): [T1, T2][] => {
    return a.map((element: T1, index: number) => [element, b[index]])
}

const get_next_stop_times = async (stop_time_ids: string[], limit: number, context: Context): Promise<(StopTime | Error)[]> => {
    const { stopTimeLoader, serviceLoader } = context.loaders;
    let date = new Date();
    let current_time: number = date.getHours() * 60 + date.getMinutes();

    // Query stop times and the days they have service
    let stop_times: StopTime[] = <StopTime[]>await stopTimeLoader.loadMany(stop_time_ids);
    let services: Service[] = <Service[]>await serviceLoader.loadMany(stop_times.map(stop_time => stop_time.service));

    let yesterday: string = days[date.getDay() - 1 < 0 ? 6 : date.getDay() - 1]     // Yesterday 
    let today: string = days[date.getDay()];                                        // Today 
    let tommorow: string = days[(date.getDay() + 1) % 7];                           // Tommorow

    let stop_times_today: AccurateStopTime[] = [];                                  // Stop times for today
    let stop_times_tommorow: AccurateStopTime[] = [];                               // Stop times for tommorow

    for (let [stop_time, service] of zip(stop_times, services)) {
        // Add stop times from yesterday that are past midnight to todays stop times
        if (service[yesterday] && stop_time.time > midnight) {
            stop_times_today.push(accurate(stop_time))
        }

        // Add todays stop times to todays or tommorwos if they're past midnight
        if (service[today]) {
            if (stop_time.time > midnight) {
                stop_times_tommorow.push(accurate(stop_time))
            } else {
                stop_times_today.push(accurate(stop_time))
            }
        }

        // Add tommorows stop times if they do not go past midnight
        if (service[tommorow] && stop_time.time < midnight) {
            stop_times_tommorow.push(accurate(stop_time))
        }
    }

    stop_times_today.sort((a: AccurateStopTime, b: AccurateStopTime) => a.time - b.time);
    stop_times_tommorow.sort((a: AccurateStopTime, b: AccurateStopTime) => a.time - b.time);
    
    // Create the list of next stop times 
    let today_index = stop_times_today.findIndex((stop_time: AccurateStopTime) => stop_time.time > current_time)
    let next_stop_times: string[] = []
    if (today_index !== -1) {
        next_stop_times = stop_times_today.slice(today_index, today_index + limit).map(stop_time => stop_time.id);
    }

    // Add the stop times for tommorow
    let i = 0;
    while ((next_stop_times.length < limit) && (i < stop_times_tommorow.length)) {
        if (stop_times_tommorow[i].time > current_time) { break; }
        next_stop_times.push(stop_times_tommorow[i].id);
        i += 1;

    }
    return stopTimeLoader.loadMany(next_stop_times);
}

export { get_next_stop_times }
