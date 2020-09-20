import { StopTime, Service } from 'api/types';

const getCurrentTime = (): number => {
    // Time minutes into the day
    let date = new Date();
    return (date.getHours() * 60) + date.getMinutes();
}

const stopTimeServiceToday = (stopTime: StopTime, service: Service, today: string, yesterday: string): boolean => {
    // Service today for a stop time
    return (!stopTime.serviceIsNextDay && service[today]) || (stopTime.serviceIsNextDay && service[yesterday]);
}

const stopTimeServiceTommorow = (stopTime: StopTime, service: Service, today: string, tommorow: string): boolean => {
    // Service tommorow for a stop time
    return (!stopTime.serviceIsNextDay && service[tommorow]) || (stopTime.serviceIsNextDay && service[today]);
}

export { getCurrentTime, stopTimeServiceToday, stopTimeServiceTommorow }
