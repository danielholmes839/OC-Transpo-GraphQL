const { populateStops, populateTrips } = require('./populate');

const resolvers = {
    Route: {
        stops: populateStops,
        trips: populateTrips
    }
}

module.exports = resolvers;