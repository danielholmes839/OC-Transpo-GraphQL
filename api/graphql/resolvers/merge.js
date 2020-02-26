const Stop = require('../../models/stop');
const User = require('../../models/user');
const Trip = require('../../models/trip');
const Route = require('../../models/route');
const Service = require('../../models/service');
const StopTime = require('../../models/stoptime');
const StopRoute = require('../../models/stoproute');
const FavouriteStop = require('../../models/favouritestop');

const populateOne = async (id, Table, transform) => {
    let document = await Table.findById(id);
    return transform(document);
};

const populateMany = async (ids, Table, transform) => {
    let documents = await Table.find({ _id: { $in: ids } });
    documents.map(document => {
        return transform(document);
    });
    return documents;
};

const transformTrip = (trip) => {
    return {
        ...trip._doc,
        _id: trip._id,
        route: populateOne.bind(this, trip._doc.route, Route, transformRoute),
        service: populateOne.bind(this, trip._doc.service, Service, transformService),
        stopTimes: populateMany.bind(this, trip._doc.stopTimes, StopTime, transformStopTime)
    }
};

const transformRoute = (route) => {
    return {
        ...route._doc,
        _id: route._id,
        trips: populateMany.bind(this, route._doc.trips, Trip, transformTrip),
        stops: populateMany.bind(this, route._doc.stops, Stop, transformStop)
    };
};

const transformStop = async (stop) => {
    return {
        ...stop._doc,
        _id: stop._id,
        routes: populateMany.bind(this, stop._doc.routes, Route, transformRoute),
        stopRoutes: populateMany.bind(this, stop._doc.routes, StopRoute, transformStopRoute)
    };
};

const transformStopRoute = (stopRoute) => {
    return {
        ...stopRoute._doc,
        _id: stopRoute._id,
        route: populateOne.bind(this, stopRoute._doc.route, Route, transformRoute),
        stopRoutes: populateMany.bind(this, stopRoute._doc.stopRoutes, StopRoute, transformStopRoute)
    };
};

const transformStopTime = (stopTime) => {
    return {
        ...stopTime._doc,
        _id: stopTime._id,
        trip: populateOne.bind(this, stopTime._doc.trip, Trip, transformTrip),
        stop: populateOne.bind(this, stopTime._doc.stop, Stop, transformStop),
    };
};

const transformService = (service) => {
    return {
        ...service._doc,
        _id: service._id,
        trips: populateTrips.bind(this, service._doc.trips)
    };
};

const transformUser = (user) => {
    return {
        ...user._doc,
        _id: user._id,
        favouriteStops: populateMany.bind(this, user._doc.favouriteStops, FavouriteStop, transformFavouriteStop),
        password: null // Never return hashed password
    };
};

const transformFavouriteStop = (favouriteStop) => {
    return {
        ...favouriteStop._doc,
        user: populateOne.bind(this, favouriteStop._doc.user, User, transformUser),
        stop: populateOne.bind(this, favouriteStop._doc.stop, Stop, transformStop),
        stopRoutes: populateMany.bind(this, favouriteStop._doc.stopRoutes, StopRoute, transformStopRoute)
    };
};

module.exports = {
    transformStop: transformStop,
    transformUser: transformUser,
    transformTrip: transformTrip,
    transformRoute: transformRoute,
    populateOne: populateOne,
    populateMany: populateMany
}