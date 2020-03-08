const { populateStop, populateRoute, populateStopTimes } = require('./populate');

const resolvers = {
    StopRoute: {
        stop: populateStop,
        route: populateRoute,
        stopTimes: populateStopTimes
    }
}

module.exports = resolvers;