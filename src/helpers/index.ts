import { StopTime, Service } from 'api/types';


const days = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
}

const getCurrentTime = (): number => {
    // Time minutes into the day
    let date = new Date();
    return (date.getHours() * 60) + date.getMinutes();
}

const getYesterday = (date: Date) => days[(date.getDay() + 6) % 7];
const getToday = (date: Date) => days[date.getDay()];
const getTomorrow  = (date: Date) => days[(date.getDay() + 1) % 7];

const stopTimeServiceToday = (stopTime: StopTime, service: Service, today: string, yesterday: string): boolean => {
    // Service today for a stop time
    return (!stopTime.serviceIsNextDay && service[today]) || (stopTime.serviceIsNextDay && service[yesterday]);
}

const stopTimeServiceTomorrow = (stopTime: StopTime, service: Service, today: string, tommorow: string): boolean => {
    // Service tommorow for a stop time
    return (!stopTime.serviceIsNextDay && service[tommorow]) || (stopTime.serviceIsNextDay && service[today]);
}

export { days, getCurrentTime, getYesterday, getToday, getTomorrow, stopTimeServiceToday, stopTimeServiceTomorrow }
