const Route = require('../../models/route');
const { transformRoute } = require('./merge');

var routeResolvers = {
    getRoutes: async () => {
        let routes = await Route.find();
        routes = routes.map(route => {
            return transformRoute(route);
        });
        return routes;
    },

    createRoute: async (args) => {
        const route = new Route({ ...args.routeInput });
        await route.save();
        return transformRoute(route);
    },

    getRoute: async ({ _id }) => {
        let route = await Route.findById(_id);
        let tranformed = transformRoute(route);
        return tranformed;
    }

};

module.exports = routeResolvers;