const DataLoader = require('dataloader');
const { User, FavouriteStop, Stop, Route, StopRoute, StopTime, Service, ServiceException, Trip } = require('../../models/index');

const populateMany = async (ids, Table) => {
    let documents = await Table.find({ _id: { $in: ids } });
    let sorted_documents = [];

    let o = {}
    for (let document of documents) {
        o[document._id] = document;
    }

    for (let id of ids) {
        sorted_documents.push(o[id]);
    }
    return sorted_documents;

};

const docId = (parent, args, context) => {
    return parent._id;
}

const loaders = {
    userLoader: new DataLoader(async (ids) => {
        /* ServiceException Batching  */
        return await populateMany(ids, User);
    }),

    favouriteStopLoader: new DataLoader(async (favouriteStops) => {
        /* FavouriteStop Batching  */
        return await populateMany(favouriteStops, FavouriteStop);
    }),

    stopLoader: new DataLoader(async (stops) => {
        /* Stop Batching  */
        return await populateMany(stops, Stop);
    }),

    routeLoader: new DataLoader(async (routes) => {
        /* Route Batching  */
        return await populateMany(routes, Route);
    }),

    stopRouteLoader: new DataLoader(async (stopRoutes) => {
        /* StopRoute Batching  */
        return populateMany(stopRoutes, StopRoute);
    }),

    stopTimeLoader: new DataLoader(async (stopTimes) => {
        /* StopTime Batching  */
        return await populateMany(stopTimes, StopTime);
    }),

    tripLoader: new DataLoader(async (trips) => {
        /* Trip Batching  */
        return await populateMany(trips, Trip);
    }),

    serviceLoader: new DataLoader(async (services) => {
        /* Service Batching  */
        return await populateMany(services, Service);
    }),

    serviceExceptionLoader: new DataLoader(async (serviceExceptions) => {
        /* ServiceException Batching  */
        return await populateMany(serviceExceptions, ServiceException);
    }),
}

module.exports = {
    populateMany, docId, ...loaders
};