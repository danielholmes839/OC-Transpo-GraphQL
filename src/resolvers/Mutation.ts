import bcrypt from 'bcryptjs';
import { Context } from 'middleware';
import { FavouriteStop, Stop, User } from 'types';
import { UserModel, FavouriteStopModel } from 'db';

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

// Mutation Resolvers
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
        if (!context.authenticated) throw new Error('Authentication Required');
        const { userLoader, favouriteStopLoader, stopLoader } = context.loaders

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
            stop: args.stop,
            stopRoutes: stop.stopRoutes
        });

        user.favouriteStops.push(favouriteStop.id);
        await favouriteStop.save();
        await user.save();
        return favouriteStop;
    },

    User_FavouriteStop_remove: async (_: void, args: User_FavouriteStop_remove_args, context: Context): Promise<FavouriteStop> => {
        /* Remove a FavouriteStop */
        if (!context.authenticated) throw new Error('Authentication Required');
        const { userLoader, favouriteStopLoader } = context.loaders;
        let favouriteStop: FavouriteStop = await favouriteStopLoader.load(args.favouriteStop);
        let user: User = await userLoader.load(context.user);
        user.favouriteStops = user.favouriteStops.filter(id => { if (id != args.favouriteStop) return id });
        await user.save();
        await FavouriteStopModel.deleteOne({ _id: args.favouriteStop }, (err) => console.log(err));
        return favouriteStop;
    },

    User_FavouriteStop_StopRoutes_add: async (_: void, args: User_FavouriteStop_StopRoute_mutation_args, context: Context): Promise<FavouriteStop> => {
        /* Adds StopRoutes to FavouriteStop */
        if (!context.authenticated) throw new Error('Authentication Required');
        const { stopLoader, favouriteStopLoader } = context.loaders
        let favouriteStop: FavouriteStop = await favouriteStopLoader.load(args.favouriteStop);
        let stop: Stop = await stopLoader.load(favouriteStop.stop);
        let all: Set<string> = new Set(stop.stopRoutes);
        let current: Set<string> = new Set(favouriteStop.stopRoutes);

        for (let stopRoute of args.stopRoutes) {
            if (all.has(stopRoute) && !current.has(stopRoute)) {
                favouriteStop.stopRoutes.push(stopRoute);
            }
        }
        return await favouriteStop.save();
    },

    User_FavouriteStop_StopRoutes_remove: async (_: void, args: User_FavouriteStop_StopRoute_mutation_args, context: Context): Promise<FavouriteStop> => {
        /* Deletes StopRoutes to FavouriteStop */
        if (!context.authenticated) throw new Error('Authentication Required');
        const { favouriteStopLoader } = context.loaders
        let favouriteStop: FavouriteStop = await favouriteStopLoader.load(args.favouriteStop);
        let remove: Set<string> = new Set(args.stopRoutes);
        favouriteStop.stopRoutes = favouriteStop.stopRoutes.filter(id => { if (!remove.has(id)) return id });
        return favouriteStop.save();
    },
}