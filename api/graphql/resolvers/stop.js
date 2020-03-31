const { Route, StopRoute } = require('../../models/index');
const { populateMany, docId } = require('./loaders');


const resolvers = {
    Stop: {
        id: docId,
        routes: async ({ routes }, args, context) => {
            return await populateMany(routes, Route);
        },
        stopRoutes: async ({ stopRoutes }, args, context) => {
            return await populateMany(stopRoutes, StopRoute);
        }
    }
}

module.exports = resolvers;