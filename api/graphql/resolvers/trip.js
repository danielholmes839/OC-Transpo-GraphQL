const { StopTime } = require('../../models/index');
const { populateMany, routeLoader, serviceLoader } = require('../helpers/DataLoaders');

const resolvers = {
    Trip: {
        id: (parent) => parent._id,
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