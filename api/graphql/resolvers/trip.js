const { Route, Service, StopTime } = require('../../models/index');
const { populateOne, populateMany, docId } = require('./helpers');

const resolvers = {
    Trip: {
        id: docId,
        route: async ({ route }, args, context) => {
            return await populateOne(route, Route);
        },
        service: async ({ service }, args, context) => {
            return await populateOne(service, Service);
        },
        stopTimes: async ({ stopTimes }, args, context) => {
            return await populateMany(stopTimes, StopTime);
        },
    }
}

module.exports = resolvers;