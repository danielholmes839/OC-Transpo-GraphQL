import { Service, ServiceException } from '../types';
import { serviceExceptionLoader } from '../loaders';

// Service Resolvers
export default {
    exceptions: (parent: Service): Promise<(ServiceException | Error)[]> => {
        return serviceExceptionLoader.loadMany(parent.exceptions);
    },
};