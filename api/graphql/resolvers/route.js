const { Trip, Stop } = require('../../models/index');
const { populateMany, docId } = require('./loaders');

const resolvers = {
    Route: {
        id: docId,
        stops: async ({ stops }, args, context) => {
            return await populateMany(stops, Stop);
        },
        trips: async ({ trips }, args, context) => {
            return await populateMany(trips, Trip);
        },
    }
}

module.exports = resolvers;