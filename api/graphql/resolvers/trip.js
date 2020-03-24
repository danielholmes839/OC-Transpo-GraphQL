const { StopTime } = require('../../models/index');
const { populateMany, docId, routeLoader, serviceLoader } = require('./helpers');

const resolvers = {
    Trip: {
        id: docId,
        route: async ({ route }, args, context) => {
            return await routeLoader.load(route);
        },
        service: async ({ service }, args, context) => {
            return await serviceLoader.load(service);
        },
        stopTimes: async ({ stopTimes }, args, context) => {
            return await populateMany(stopTimes, StopTime);
        },
    }
}

module.exports = resolvers;