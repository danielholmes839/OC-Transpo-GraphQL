const { Stop, Route, StopTime } = require('../../models/index');
const { populateOne, populateMany, docId } = require('./helpers');

const resolvers = {
    StopRoute: {
        id: docId,
        stop: async ({ stop }, args, context) => {
            return await populateOne(stop, Stop);
        },
        route: async ({ route }, args, context) => {
            return await populateOne(route, Route);
        },
        stopTimes: async ({ stopTimes }, args, context) => {
            return await populateMany(stopTimes, StopTime);
        },
        nextStopTime: async ({ stopTimes }, args, context) => {
            // Not Implemented
            return await populateOne(stopTimes[0], StopTime);
        }
    }
}

module.exports = resolvers;