import { StopTime, Service, Day } from 'api/types';


const days = {
    0: Day.SUNDAY,
    1: Day.MONDAY,
    2: Day.TUESDAY,
    3: Day.WEDNESDAY,
    4: Day.THURSDAY,
    5: Day.FRIDAY,
    6: Day.SATURDAY,
}

const getCurrentTime = (): number => {
    // Time minutes into the day
    let date = new Date();
    return (date.getHours() * 60) + date.getMinutes();
}

const getYesterday = (date: Date): Day => days[(date.getDay() + 6) % 7];
const getToday = (date: Date): Day => days[date.getDay()];
const getTomorrow = (date: Date): Day => days[(date.getDay() + 1) % 7];

const stopTimeServiceToday = (stopTime: StopTime, service: Service, today: string, yesterday: string): boolean => {
    // Service today for a stop time
    return (!stopTime.serviceIsNextDay && service[today]) || (stopTime.serviceIsNextDay && service[yesterday]);
}

const stopTimeServiceTomorrow = (stopTime: StopTime, service: Service, today: string, tomorrow: string): boolean => {
    // Service tomorrow for a stop time
    return (!stopTime.serviceIsNextDay && service[tomorrow]) || (stopTime.serviceIsNextDay && service[today]);
}

export { days, getCurrentTime, getYesterday, getToday, getTomorrow, stopTimeServiceToday, stopTimeServiceTomorrow }
