/* Favourite Stop Resolvers */
import { Context } from 'middleware';
import { Stop, StopRoute, User, FavouriteStop } from 'api/types';

export default {
    user: (parent: FavouriteStop, _: void, context: Context): Promise<(User | Error)> => {
        const { userLoader } = context.loaders;
        return userLoader.load(parent.user);
    },
    stop: (parent: FavouriteStop, _: void, context: Context): Promise<(Stop | Error)> => {
        const { stopLoader } = context.loaders;
        return stopLoader.load(parent.stop);
    },
    stopRoutes: (parent: FavouriteStop, _: void, context: Context): Promise<(StopRoute | Error)[]> => {
        const { stopRouteLoader } = context.loaders;
        return stopRouteLoader.loadMany(parent.stopRoutes);
    },
};