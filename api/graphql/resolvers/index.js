const queryResolvers = require('./query');
const mutationResolvers = require('./mutation');

const routeResolvers = require('./route');
const routeGPSResolvers = require('./routegps');

const stopResolvers = require('./stop');
const stopTimeResolvers = require('./stopTime');
const stopRouteResolvers = require('./stoproute');
const favouriteStopResolvers = require('./favouriteStop');

const tripResolvers = require('./trip');
const serviceResolvers = require('./service');
const userResolvers = require('./user');
const nodeResolvers = require('./node');

const mapScalar = require('./map');

const resolvers = {
    Query: queryResolvers.Query,
    Mutation: mutationResolvers.Mutation,

    Route: routeResolvers.Route,
    RouteGPS: routeGPSResolvers.RouteGPS,
    Stop: stopResolvers.Stop,
    StopTime: stopTimeResolvers.StopTime,
    StopRoute: stopRouteResolvers.StopRoute,
    FavouriteStop: favouriteStopResolvers.FavouriteStop,
    Trip: tripResolvers.Trip,
    Service: serviceResolvers.Service,
    User: userResolvers.User,
    Node: nodeResolvers.Node,

    Map: mapScalar
}

module.exports = resolvers;