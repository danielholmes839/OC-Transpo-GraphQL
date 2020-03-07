const { populateUser, populateStop, populateStopRoutes } = require('./populate');

const resolvers = {
    FavouriteStop: {
        user: populateUser,
        stop: populateStop,
        stopRoutes: populateStopRoutes
    }
}

module.exports = resolvers;