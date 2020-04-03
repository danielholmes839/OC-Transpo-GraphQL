const { Trip, Stop } = require('../../models/index');
const { populateMany } = require('../helpers/DataLoaders');

const resolvers = {
    Route: {
        id: (parent) => parent._id,
        stops: async ({ stops }, args, context) => {
            return await populateMany(stops, Stop);
        },
        trips: async ({ trips }, args, context) => {
            return await populateMany(trips, Trip);
        },
    }
}

module.exports = resolvers;