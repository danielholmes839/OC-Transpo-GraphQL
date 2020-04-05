import { Stop, StopRoute, User, FavouriteStop } from '../types';
import { stopLoader, stopRouteLoader, userLoader } from '../loaders';

export default {
    user: (parent: FavouriteStop): Promise<(User | Error)> => {
        return userLoader.load(parent.user);
    },
    stop: (parent: FavouriteStop): Promise<(Stop | Error)> => {
        return stopLoader.load(parent.stop);
    },
    stopRoutes: (parent: FavouriteStop): Promise<(StopRoute | Error)[]> => {
        return stopRouteLoader.loadMany(parent.stopRoutes);
    },
};