const { StopRoute } = require('../../models/index');
const { populateMany, userLoader, stopLoader } = require('../helpers/DataLoaders');;

const resolvers = {
    FavouriteStop: {
        id: (parent) => parent._id,
        user: async (parent, args, { user }) => {
            return userLoader.load(user);
        },
        stop: async ({ stop }, args, context) => {
            return stopLoader.load(stop);
        },
        stopRoutes: async ({ stopRoutes, stop }, args, context) => {
            return populateMany(stopRoutes, StopRoute);
        }
    }
}

module.exports = resolvers;