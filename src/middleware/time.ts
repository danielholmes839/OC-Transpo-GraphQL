import { Day } from 'types';
import { yesterday, today, tomorrow, time } from 'schedule';

type TimeInfo = {
    object: Date;
    yesterday: Day;
    today: Day;
    tomorrow: Day;
    time: number;   // minutes into the day
    unix: number;   // unix time in milliseconds
}

const timeMiddleware = (): TimeInfo => {
    const date = new Date();
    return {
        object: date,
        yesterday: yesterday(date),
        today: today(date),
        tomorrow: tomorrow(date),
        unix: date.getTime(),
        time: time(date)
    }
}

export { timeMiddleware, TimeInfo}