const queryResolvers = require('./query');
const routeResolvers = require('./route');
const stopResolvers = require('./stop');
const tripResolvers = require('./trip');
const stopTimeResolvers = require('./stopTime');
const favouriteStopResolvers = require('./favouriteStop');

console.log(favouriteStopResolvers);

const resolvers = {
    Query: queryResolvers.Query,
    Route: routeResolvers.Route,
    Stop: stopResolvers.Stop,
    Trip: tripResolvers.Trip,
    StopTime: stopTimeResolvers.StopTime,
    FavouriteStop: favouriteStopResolvers.FavouriteStop
}

console.log(resolvers);

module.exports = resolvers;