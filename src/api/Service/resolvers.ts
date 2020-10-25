import { Context } from 'middleware';
import { Service, ServiceException, Day } from 'api/types';
import { serviceRunning } from 'helpers';

// Service Resolvers
export default {
    active: (parent: Service, _: void, { datetime }: Context) => serviceRunning(datetime.unix, parent),
    runningToday: (parent: Service, _: void, { datetime }: Context) => parent[datetime.today],
    runningTomorrow: (parent: Service, _: void, { datetime }: Context) => parent[datetime.tomorrow],
    runningOn: (parent: Service, input: { day: Day }): boolean => parent[input.day],
    runningOnMany: (parent: Service, input: { days: Day[] }): boolean[] => input.days.map(day => parent[day]),
    exceptionCount: (parent: Service): number => parent.exceptions.length,
    exceptions: (parent: Service, _: void, { loaders }: Context): Promise<(ServiceException | Error)[]> => {
        const { serviceExceptionLoader } = loaders;
        return serviceExceptionLoader.loadMany(parent.exceptions);
    },
};