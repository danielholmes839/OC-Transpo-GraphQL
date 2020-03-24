const { StopTime } = require('../../models/index');
const { populateMany, docId, stopLoader, routeLoader, stopTimeLoader } = require('./loaders');

const resolvers = {
    StopRoute: {
        id: docId,
        stop: async ({ stop }, args, context) => {
            return await stopLoader.load(stop);
        },
        route: async ({ route }, args, context) => {
            return await routeLoader.load(route);
        },
        stopTimes: async ({ stopTimes }, args, context) => {
            return await populateMany(stopTimes, StopTime);
        },
        nextStopTime: async ({ stopTimes }, args, context) => {
            // Not Implemented
            return await stopTimeLoader.load(stopTimes[0]);
        }
    }
}

module.exports = resolvers;