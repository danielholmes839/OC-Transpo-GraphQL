import { Context } from 'middleware';
import { Service, ServiceException } from 'api/types';

// Service Resolvers
export default {
    exceptions: (parent: Service, _: void, context: Context): Promise<(ServiceException | Error)[]> => {
        const { serviceExceptionLoader } = context.loaders;
        return serviceExceptionLoader.loadMany(parent.exceptions);
    },
};