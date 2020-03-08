const { Route, Stop, Trip, StopTime, Service, FavouriteStop, StopRoute, User } = require('../../models/index');

const populateMany = async (ids, Table) => {
    return await Table.find({ _id: { $in: ids } });
};

const populateOne = async (id, Table) => {
    return await Table.findById(id);
};

const populateMethods = {
    populateRoute: async ({ route }, args, context) => {
        return await populateOne(route, Route);
    },

    populateRoutes: async ({ routes }, args, context) => {
        return await populateMany(routes, Route);
    },

    populateStop: async ({ stop }, parent, context) => {
        return await populateOne(stop, Stop);
    },

    populateStops: async ({ stops }, parent, context) => {
        return await populateMany(stops, Stop);
    },

    populateTrip: async ({ trip }, parent, context) => {
        return await populateOne(trip, Trip);
    },

    populateTrips: async ({ trips }, parent, context) => {
        return await populateMany(trips, Trip);
    },

    populateStopTime: async ({ stopTime }, parent, context) => {
        return await populateOne(stopTime, StopTime);
    },

    populateStopTimes: async ({ stopTimes }, parent, context) => {
        return await populateMany(stopTimes, StopTime);
    },

    populateStopRoute: async ({ stopRoute }, parent, context) => {
        return await populateOne(stopRoute, StopRoute);
    },

    populateStopRoutes: async ({ stopRoutes }, parent, context) => {
        return await populateMany(stopRoutes, StopRoute);
    },

    populateFavouriteStop: async ({ favouriteStop }, parent, context) => {
        return await populateOne(favouriteStop, FavouriteStop);
    },

    populateFavouriteStops: async ({ favouriteStops }, parent, context) => {
        return await populateMany(favouriteStops, FavouriteStop);
    },

    populateService: async ({ service }, parent, context) => {
        return await populateOne(service, Service);
    },

    populateUser: async ({ user }, parent, context) => {
        return await populateOne(user, User);
    },
};

module.exports = {
    populateOne: populateOne,
    populateMany: populateMany,
    ...populateMethods
}