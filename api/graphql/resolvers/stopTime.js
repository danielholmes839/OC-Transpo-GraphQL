const { docId, tripLoader, stopLoader, routeLoader } = require('./loaders');

const resolvers = {
    StopTime: {
        id: docId,
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