const { Route, StopRoute } = require('../../models/index');
const { populateMany } = require('../helpers/DataLoaders');


const resolvers = {
    Stop: {
        id: (parent) => parent._id,
        routes: async ({ routes }, args, context) => {
            return await populateMany(routes, Route);
        },
        stopRoutes: async ({ stopRoutes }, args, context) => {
            return await populateMany(stopRoutes, StopRoute);
        }
    }
}

module.exports = resolvers;