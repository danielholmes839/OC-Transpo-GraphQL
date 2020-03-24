const { Stop, StopRoute} = require('../../models/index');
const { populateOne, populateMany, populateUser, docId } = require('./helpers');

const resolvers = {
    FavouriteStop: {
        id: docId,
        user: async (parent, args, { user }) => {
            return populateUser(user);
        },
        stop: async ({ stop }, args, context) => {
            return populateOne(stop, Stop);
        },
        stopRoutes: async ({ stopRoutes }, args, context) => {
            return populateMany(stopRoutes, StopRoute);
        }
    }
}

module.exports = resolvers;