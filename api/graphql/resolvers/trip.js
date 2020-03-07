const { populateRoute, populateService, populateStopTimes } = require('./populate');

const resolvers = {
    Trip: {
        route: populateRoute,
        service: populateService,
        stopTimes: populateStopTimes
    }
}

module.exports = resolvers;