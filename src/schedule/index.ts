import { StopTime, Service, Day } from 'types';
import { TimeDuplicateChecker, ServiceDuplicateChecker, DetailedServiceDuplicateChecker } from './duplicates';

const DAYS = {
    0: Day.SUNDAY,
    1: Day.MONDAY,
    2: Day.TUESDAY,
    3: Day.WEDNESDAY,
    4: Day.THURSDAY,
    5: Day.FRIDAY,
    6: Day.SATURDAY,
}

// Get the Day yesterday
const yesterday = (date: Date): Day => DAYS[(date.getDay() + 6) % 7];

// Get the Day today
const today = (date: Date): Day => DAYS[date.getDay()];

// Get the Day tommorow
const tomorrow = (date: Date): Day => DAYS[(date.getDay() + 1) % 7];

const time = (date: Date): number => {
    // Time minutes into the day
    return (date.getHours() * 60) + date.getMinutes();
}

const stopTimeServiceToday = (stopTime: StopTime, service: Service, today: Day, yesterday: Day): boolean => {
    // Service today for a stop time
    return (!stopTime.serviceIsNextDay && service[today]) || (stopTime.serviceIsNextDay && service[yesterday]);
}

const stopTimeServiceTomorrow = (stopTime: StopTime, service: Service, today: Day, tomorrow: Day): boolean => {
    // Service tomorrow for a stop time
    return (!stopTime.serviceIsNextDay && service[tomorrow]) || (stopTime.serviceIsNextDay && service[today]);
}

const serviceRunning = (unixTime: number, service: Service): boolean => {
    // checks current time is between start and end time of service
    return (unixTime > service.start) && (unixTime < service.end)
}

export {
    DAYS, time, yesterday, today, tomorrow, stopTimeServiceToday, stopTimeServiceTomorrow, serviceRunning,
    TimeDuplicateChecker, ServiceDuplicateChecker, DetailedServiceDuplicateChecker
}
