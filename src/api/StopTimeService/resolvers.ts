import { Context } from 'middleware';
import { StopTimeService } from './types';

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
    serviceToday: (parent: StopTimeService, _: void, { datetime }: Context) => serviceFunctions[datetime.today](parent),
    serviceTomorrow: (parent: StopTimeService, _: void, { datetime }: Context) => serviceFunctions[datetime.tommorow](parent),
    serviceIsNextDay: (parent: StopTimeService) => parent.serviceIsNextDay,
    ...serviceFunctions
}