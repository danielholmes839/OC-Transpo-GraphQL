import { Context } from 'middleware';
import { StopTimeService, Day } from 'api/types';

const serviceFunctions = {
    monday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.sunday : parent.service.monday,
    tuesday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.monday : parent.service.tuesday,
    wednesday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.tuesday : parent.service.wednesday,
    thursday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.wednesday : parent.service.thursday,
    friday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.thursday : parent.service.friday,
    saturday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.friday : parent.service.saturday,
    sunday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.saturday : parent.service.sunday,
}

export default {
    service: (parent: StopTimeService) => parent.service,
    runningToday: (parent: StopTimeService, _: void, { datetime }: Context): boolean => serviceFunctions[datetime.today](parent),
    runningTomorrow: (parent: StopTimeService, _: void, { datetime }: Context): boolean => serviceFunctions[datetime.tomorrow](parent),
    runningOn: (parent: StopTimeService, input: { day: Day }): boolean => serviceFunctions[input.day](parent),
    runningOnMany: (parent: StopTimeService, input: { days: Day[] }): boolean[] => input.days.map(day => serviceFunctions[day](parent))
}