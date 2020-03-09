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

    populateStop: async ({ stop }, args, context) => {
        return await populateOne(stop, Stop);
    },

    populateStops: async ({ stops }, args, context) => {
        return await populateMany(stops, Stop);
    },

    populateTrip: async ({ trip }, args, context) => {
        return await populateOne(trip, Trip);
    },

    populateTrips: async ({ trips }, args, context) => {
        return await populateMany(trips, Trip);
    },

    populateStopTime: async ({ stopTime }, args, context) => {
        return await populateOne(stopTime, StopTime);
    },

    populateStopTimes: async ({ stopTimes }, args, context) => {
        return await populateMany(stopTimes, StopTime);
    },

    populateStopRoute: async ({ stopRoute }, args, context) => {
        return await populateOne(stopRoute, StopRoute);
    },

    populateStopRoutes: async ({ stopRoutes }, args, context) => {
        return await populateMany(stopRoutes, StopRoute);
    },

    populateFavouriteStop: async ({ favouriteStop }, args, context) => {
        return await populateOne(favouriteStop, FavouriteStop);
    },

    populateFavouriteStops: async ({ favouriteStops }, args, context) => {
        return await populateMany(favouriteStops, FavouriteStop);
    },

    populateService: async ({ service }, parent, context) => {
        return await populateOne(service, Service);
    },

    populateUser: async ({ user }, parent, context) => {
        let result = await populateOne(user, User);
        result.password = null;
        return result;
    },
};

module.exports = {
    populateOne: populateOne,
    populateMany: populateMany,
    ...populateMethods
}