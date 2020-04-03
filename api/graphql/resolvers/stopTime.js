const { tripLoader, stopLoader, routeLoader } = require('../helpers/DataLoaders');

const resolvers = {
    StopTime: {
        id: (parent) => parent._id,
        trip: async ({ trip }, args, context) => {
            return await tripLoader.load(trip);
        },
        stop: async ({ stop }, args, context) => {
            return await stopLoader.load(stop);
        },
        route: async ({ route }, args, context) => {
            return await routeLoader.load(route);
        },
    }
}

module.exports = resolvers;