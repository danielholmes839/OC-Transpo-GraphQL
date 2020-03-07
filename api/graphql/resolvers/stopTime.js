const { populateTrip, populateStop, populateRoute } = require('./populate');

const resolvers = {
    StopTime: {
        trip: populateTrip,
        stop: populateStop,
        route: populateRoute
    }
}

module.exports = resolvers;