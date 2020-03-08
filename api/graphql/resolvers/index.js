const queryResolvers = require('./query');
const mutationResolvers = require('./mutation');

const routeResolvers = require('./route');
const stopResolvers = require('./stop');
const tripResolvers = require('./trip');
const stopTimeResolvers = require('./stopTime');
const stopRouteResolvers = require('./stopRoute');
const favouriteStopResolvers = require('./favouriteStop');

const resolvers = {
    Query: queryResolvers.Query,
    Mutation: mutationResolvers.Mutation,
    Route: routeResolvers.Route,
    Stop: stopResolvers.Stop,
    Trip: tripResolvers.Trip,
    StopTime: stopTimeResolvers.StopTime,
    StopRoute: stopRouteResolvers.StopRoute,
    FavouriteStop: favouriteStopResolvers.FavouriteStop
}

console.log(resolvers);

module.exports = resolvers;