const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { populateMany, stopLoader, userLoader } = require('./loaders');
const { User, FavouriteStop, Stop, StopRoute } = require('../../models/index');

const resolvers = {
    Mutation: {
        userCreate: async (root, { email, password }, context) => {
            let user = await User.findOne({ email: email })
            if (user) { throw new Error("This Email is taken"); }

            user = new User({
                email: email,
                password: await bcrypt.hash(password, 12)
            });

            await user.save();
            user.password = null;
            return user
        },

        userFavouriteStopAdd: async (root, { favouriteStop }, context) => {
            if (context.user == null) {
                throw new Error("User Missing");
            }

            let stop = await stopLoader.load(favouriteStop.stop)     // Check that the stop exists
            if (!stop) { throw new Error('Stop does not exist'); }

            if (favouriteStop.stopRoutes === undefined) {
                favouriteStop.stopRoutes = stop.stopRoutes;
            }

            let stopRoutes = new Set(stop.stopRoutes);

            for (let stopRoute of favouriteStop.stopRoutes) {
                if (!stopRoutes.has(stopRoute)) {
                    throw new Error(`StopRoute id:${stopRoute} does not exist for Stop id:${favouriteStop.stop}`)
                }
            }

            let user = await userLoader.load(context.user);             // Check that the user exists 
            if (!user) { throw new Error('User does not exist'); }      // CHECKING THIS WILL PROBABLY CHANGE
            const favouriteStops = await populateMany(user.favouriteStops, FavouriteStop);

            const stops = new Set();
            favouriteStops.map(favouriteStop => {
                stops.add(favouriteStop.stop);
            });

            if (stops.has(favouriteStop.stop)) {
                throw new Error(`User already favourites stop id:${favouriteStop.stop}`);
            }

            favouriteStop.user = context.user;
            const favouriteStopDocument = new FavouriteStop(favouriteStop);
            await favouriteStopDocument.save();

            user.favouriteStops.push(favouriteStopDocument._id);
            await user.save();

            return favouriteStop;
        }
    }
}

module.exports = resolvers;