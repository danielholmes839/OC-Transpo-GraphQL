import { StopTimeService } from './types';

export default {
    service: (parent: StopTimeService) => parent.service,
    serviceIsNextDay: (parent: StopTimeService) => parent.serviceIsNextDay,
    monday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.sunday : parent.service.monday,
    tuesday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.monday : parent.service.tuesday,
    wednesday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.tuesday : parent.service.wednesday,
    thursday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.wednesday : parent.service.thursday,
    friday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.thursday : parent.service.friday,
    saturday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.friday : parent.service.saturday,
    sunday: (parent: StopTimeService) => parent.serviceIsNextDay ? parent.service.saturday : parent.service.sunday,
}