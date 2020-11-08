import { Day } from 'types';
import { getYesterday, getToday, getTomorrow, getCurrentTime } from 'helpers';

type TimeInfo = {
    yesterday: Day;
    today: Day;
    tomorrow: Day;
    time: number;   // minutes into the day
    unix: number;   // unix time in milliseconds
}

const timeMiddleware = (): TimeInfo => {
    const date = new Date();
    return {
        yesterday: getYesterday(date),
        today: getToday(date),
        tomorrow: getTomorrow(date),
        unix: date.getTime(),
        time: getCurrentTime()
    }
}

export { timeMiddleware, TimeInfo}