const { tripLoader, stopLoader, routeLoader } = require('../helpers/DataLoaders');

const resolvers = {
    StopTime: {
        id: (parent) => parent._id,
        trip: async ({ trip }, args, context) => {
            return await tripLoader.load(trip);
        },
        stop: async ({ stop }, args, context) => {
            return await stopLoader.load(stop);
        }
    }
}

module.exports = resolvers;