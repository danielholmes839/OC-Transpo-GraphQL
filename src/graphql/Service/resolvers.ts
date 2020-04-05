import { Service, ServiceException } from '../types';
import { serviceExceptionLoader } from '../loaders';

export default {
    exceptions: (parent: Service): Promise<(ServiceException | Error)[]> => {
        return serviceExceptionLoader.loadMany(parent.exceptions);
    },
};