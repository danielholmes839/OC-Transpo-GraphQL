const queryResolvers = require('./query');
const mutationResolvers = require('./mutation');
const stopResolvers = require('./stop');
const routeResolvers = require('./route');
const stopRouteResolvers = require('./stoproute');

const StopRouteGPS = require('./StopRouteGPS');

const stopRouteMapScalar = require('./StopRouteMap');
const tripResolvers = require('./trip');
const serviceResolvers = require('./service');
const stopTimeResolvers = require('./stopTime');
const userResolvers = require('./user');
const favouriteStopResolvers = require('./favouriteStop');
const nodeResolvers = require('./node');


const resolvers = {
    Query: queryResolvers.Query,
    Mutation: mutationResolvers.Mutation,
    Stop: stopResolvers.Stop,
    Route: routeResolvers.Route,
    StopRoute: stopRouteResolvers.StopRoute,
    StopRouteGPS,
    StopRouteMap: stopRouteMapScalar,
    Trip: tripResolvers.Trip,
    Service: serviceResolvers.Service,
    StopTime: stopTimeResolvers.StopTime,
    User: userResolvers.User,
    FavouriteStop: favouriteStopResolvers.FavouriteStop,
    Node: nodeResolvers.Node
}

module.exports = resolvers;