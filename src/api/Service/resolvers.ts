import { Context } from 'middleware';
import { Service, ServiceException } from 'api/types';

// Service Resolvers
export default {
    serviceToday: (parent: Service, _: void, { datetime }: Context) => parent[datetime.today],
    serviceTomorrow: (parent: Service, _: void, { datetime }: Context) => parent[datetime.tomorrow],
    exceptions: (parent: Service, _: void, { loaders }: Context): Promise<(ServiceException | Error)[]> => {
        const { serviceExceptionLoader } = loaders;
        return serviceExceptionLoader.loadMany(parent.exceptions);
    },
};