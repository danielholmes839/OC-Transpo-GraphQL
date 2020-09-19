import { Context } from 'middleware';
import { User, FavouriteStop } from 'api/types';

// User Resolvers
export default {
    favouriteStops: (parent: User, _: void, context: Context): Promise<(FavouriteStop | Error)[]> => {
        const { favouriteStopLoader } = context.loaders;
        return favouriteStopLoader.loadMany(parent.favouriteStops);
    },
}