const { Trip, Stop, Route } = require('../../models/index');
const { populateOne, docId } = require('./helpers');

const resolvers = {
    StopTime: {
        id: docId,
        trip: async ({ trip }, args, context) => {
            return await populateOne(trip, Trip);
        },
        stop: async ({ stop }, args, context) => {
            return await populateOne(stop, Stop);
        },
        route: async ({ route }, args, context) => {
            return await populateOne(route, Route);
        },
    }
}

module.exports = resolvers;