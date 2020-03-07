const { populateRoutes, populateStopRoutes } = require('./populate');

const resolvers = {
    Stop: {
        routes: populateRoutes,
        stopRoutes: populateStopRoutes
    }
}

module.exports = resolvers;