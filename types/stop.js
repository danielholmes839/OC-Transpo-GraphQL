const { Route } = require('./route');
const { ROUTES } = require('../data');

class Stop {
    /* Access with stop_code */
    constructor({ id, code, name, lat, lon, routes }) {
        console.log(id);
        this.id = id
        this.code = code;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.routes = routes
    };

    getRoutes() {
        /* Create this.routes */
        var routes = [];
        for (var route of this.routes) {
            routes.push(new Route(ROUTES[route], this.id));
        }
        return routes;
    }
};

module.exports = {
    Stop: Stop
};
