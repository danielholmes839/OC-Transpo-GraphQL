import { User, FavouriteStop } from '../types';
import { favouriteStopLoader } from '../loaders';

export default {
    password: () => null,   // must always be null
    favouriteStops: (parent: User): Promise<(FavouriteStop | Error)[]> => {
        return favouriteStopLoader.loadMany(parent.favouriteStops);
    },
}