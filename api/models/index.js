const Stop = require('./stop');
const User = require('./user');
const Trip = require('./trip');
const Route = require('./route');
const Service = require('./service');
const ServiceException = require('./serviceexception');
const StopTime = require('./stoptime');
const StopRoute = require('./stoproute');
const FavouriteStop = require('./favouritestop');

module.exports = {
    Stop: Stop,
    User: User,
    Trip: Trip,
    Route: Route,
    Service: Service,
    ServiceException: ServiceException,
    StopTime: StopTime,
    StopRoute: StopRoute,
    FavouriteStop, FavouriteStop,
}