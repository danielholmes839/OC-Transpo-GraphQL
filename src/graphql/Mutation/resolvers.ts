import { FavouriteStop, Stop, StopRoute, Login, Context, User } from '../types';
import { stopLoader, stopRouteLoader, favouriteStopLoader, userLoader } from '../loaders';
import { FavouriteStopCollection, UserCollection } from '../collections';


const getValidStopRoutes = (requested: string[], existing: string[]): string[] => {
    const existingSet: Set<string> = new Set(existing);
    const valid: string[] = [];
    for (let stopRoute of requested) {
        if (existingSet.has(stopRoute)) valid.push(stopRoute);
    }
    return valid;
}

const getFavouriteStop = async (favouriteStopID: string, context: Context): Promise<FavouriteStop> => {
    /* Get the favourite stop and handles authentication */
    if (!context.authenticated) throw new Error("Not Authenticated");                               // Authenticated
    const favouriteStop: FavouriteStop = await favouriteStopLoader.load(favouriteStopID);           // Load FavouriteStop
    if (!favouriteStop) throw new Error(`FavouriteStop ID:${favouriteStopID} does not exist`);      // FavouriteStop exists
    if (favouriteStop.user != context.user) throw new Error(`Not Authorized`);                      // FavouriteStop belongs to user
    return favouriteStop;
}


const resolvers = {
    //userCreate: (_: void, email: string, password: String!):

    userFavouriteStopAdd: async (_: void, args: UserFavouriteStopAdd, context: Context): Promise<FavouriteStop> => {
        /*  Add FavouriteStop */
        if (!context.authenticated) throw new Error("Not Authenticated");
        const stop: Stop = await stopLoader.load(args.stop);
        if (!stop) throw new Error(`Stop ID:${args.stop} does not exist`);     // Make sure the stop exists
        if (!args.stopRoutes) args.stopRoutes = stop.stopRoutes;               // If the stop routes are not specified add all of them

        const user: User = await userLoader.load(context.user);
        const favouriteStops: any | FavouriteStop = await favouriteStopLoader.loadMany(user.favouriteStops);
        for (let favouriteStop of favouriteStops) {
            if (favouriteStop.stop === args.stop) throw new Error(`Stop ID:${favouriteStop.stop} is already a favourite`);
        }

        const favouriteStop: FavouriteStop = new FavouriteStopCollection({
            user: context.user,
            stop: args.stop,
            stopRoutes: getValidStopRoutes(args.stopRoutes, stop.stopRoutes)
        });

        user.favouriteStops.push(favouriteStop.id);
        await user.save();
        return favouriteStop.save();
    },

    userFavouriteStopDelete: async (_: void, args: UserFavouriteStopDelete, context: Context): Promise<FavouriteStop> => {
        /* Delete FavouriteStop */
        const favouriteStop: FavouriteStop = await getFavouriteStop(args.favouriteStop, context);
        const user: User = await userLoader.load(context.user);
        user.favouriteStops = user.favouriteStops.filter(id => { if (id != args.favouriteStop) return id });

        await user.save();
        FavouriteStopCollection.deleteOne({ _id: args.favouriteStop }, (err) => console.log(err));
        return favouriteStop;
    },
    userFavouriteStopRoutesAdd: async (_: void, args: UserFavouriteStopRouteAdd, context: Context): Promise<FavouriteStop> => {
        /* Adds StopRoutes to FavouriteStop */
        const favouriteStop: FavouriteStop = await getFavouriteStop(args.favouriteStop, context);
        const stop: Stop = await stopLoader.load(favouriteStop.stop);
        const all: Set<string> = new Set(stop.stopRoutes);
        const current: Set<string> = new Set(favouriteStop.stopRoutes);

        for (let stopRoute of args.stopRoutes) {
            if (all.has(stopRoute) && !current.has(stopRoute)) {
                favouriteStop.stopRoutes.push(stopRoute);
            }
        }

        return favouriteStop.save();

    },
    userFavouriteStopRoutesDelete: async (_: void, args: UserFavouriteStopRouteDelete, context: Context): Promise<FavouriteStop> => {
        /* Deletes StopRoutes to FavouriteStop */
        const favouriteStop: FavouriteStop = await getFavouriteStop(args.favouriteStop, context);
        const remove: Set<string> = new Set(args.stopRoutes);
        favouriteStop.stopRoutes = favouriteStop.stopRoutes.filter(id => { if (!remove.has(id)) return id });
        return favouriteStop.save();
    },
}

export default resolvers;