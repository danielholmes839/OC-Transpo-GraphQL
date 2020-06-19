import { FavouriteStop, Stop, Context, User } from '../types';
import { stopLoader, favouriteStopLoader, userLoader } from '../loaders';
import { FavouriteStopModel } from '../models';
import { UserModel } from '../User/model';
import bcrypt from 'bcrypt';


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
    if (!context.authenticated) throw new Error("Not Authenticated");                                       // Authenticated
    const favouriteStop: FavouriteStop = await favouriteStopLoader.load(favouriteStopID);                   // Load FavouriteStop
    if (favouriteStop === null) throw new Error(`FavouriteStop ID:${favouriteStopID} does not exist`);      // FavouriteStop exists
    if (favouriteStop.user != context.user) throw new Error(`Not Authorized`);                              // FavouriteStop belongs to user
    return favouriteStop;
}


type User_create_args = {
    email: string;
    password: string;
}

type User_FavouriteStop_add_args = {
    stop: string;
}

type User_FavouriteStop_remove_args = {
    favouriteStop: string;
}

type User_FavouriteStop_StopRoute_mutation_args = {
    favouriteStop: string;
    stopRoutes: string[];
}

export default {
    User_create: async (_: void, { email, password }: User_create_args, context: Context): Promise<User> => {
        /* Create a User */
        let existing_user = await UserModel.findOne({ email: email });
        if (existing_user !== null) throw Error('Email is already taken');
        let user = new UserModel({
            email: email,
            password: await bcrypt.hash(password, 10),
            favouriteStops: []
        });
        await user.save();
        return user;
    },

    User_FavouriteStop_add: async (_: void, args: User_FavouriteStop_add_args, context: Context): Promise<FavouriteStop> => {
        /*  Add a FavouriteStop to a user */
        // Make sure the user is authenticated
        if (!context.authenticated) throw new Error("Not Authenticated");

        // Make sure the stop they want to favourite exists
        let stop = await stopLoader.load(args.stop);
        if (stop === null) throw Error(`Stop ID:${args.stop} does not exist`);

        // Load the user
        let user = await userLoader.load(context.user);

        // Make sure the user does not already favourite the stop
        for (let favouriteStop of <FavouriteStop[]>await favouriteStopLoader.loadMany(user.favouriteStops)) {
            if (favouriteStop.stop === args.stop) {
                throw Error(`User already favourites Stop ID:${args.stop}`)
            }
        }

        // Create the favourite stop
        let favouriteStop = new FavouriteStopModel({
            user: context.user,
            stop: stop,
            stopRoutes: stop.stopRoutes
        });

        user.favouriteStops.push(favouriteStop.id);
        await favouriteStop.save();
        await user.save();
        return favouriteStop;
    },

    User_FavouriteStop_remove: async (_: void, args: User_FavouriteStop_remove_args, context: Context): Promise<FavouriteStop> => {
        /* Remove a FavouriteStop */
        let favouriteStop: FavouriteStop = await getFavouriteStop(args.favouriteStop, context);
        let user: User = await userLoader.load(context.user);
        user.favouriteStops = user.favouriteStops.filter(id => { if (id != args.favouriteStop) return id });
        await user.save();
        FavouriteStopModel.deleteOne({ _id: args.favouriteStop }, (err) => console.log(err));
        return favouriteStop;
    },

    User_FavouriteStop_StopRoute_add: async (_: void, args: User_FavouriteStop_StopRoute_mutation_args, context: Context): Promise<FavouriteStop> => {
        /* Adds StopRoutes to FavouriteStop */
        let favouriteStop: FavouriteStop = await getFavouriteStop(args.favouriteStop, context);
        let stop: Stop = await stopLoader.load(favouriteStop.stop);
        let all: Set<string> = new Set(stop.stopRoutes);
        let current: Set<string> = new Set(favouriteStop.stopRoutes);

        for (let stopRoute of args.stopRoutes) {
            if (all.has(stopRoute) && !current.has(stopRoute)) {
                favouriteStop.stopRoutes.push(stopRoute);
            }
        }
        return favouriteStop.save();
    },

    User_FavouriteStop_StopRoute_remove: async (_: void, args: User_FavouriteStop_StopRoute_mutation_args, context: Context): Promise<FavouriteStop> => {
        /* Deletes StopRoutes to FavouriteStop */
        let favouriteStop: FavouriteStop = await getFavouriteStop(args.favouriteStop, context);
        let remove: Set<string> = new Set(args.stopRoutes);
        favouriteStop.stopRoutes = favouriteStop.stopRoutes.filter(id => { if (!remove.has(id)) return id });
        return favouriteStop.save();
    },
}