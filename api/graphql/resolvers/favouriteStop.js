const { StopRoute} = require('../../models/index');
const { populateMany, docId, userLoader, stopLoader } = require('./helpers');

const resolvers = {
    FavouriteStop: {
        id: docId,
        user: async (parent, args, { user }) => {
            return userLoader.load(user);
        },
        stop: async ({ stop }, args, context) => {
            return stopLoader.load(stop);
        },
        stopRoutes: async ({ stopRoutes }, args, context) => {
            return populateMany(stopRoutes, StopRoute);
        }
    }
}

module.exports = resolvers;