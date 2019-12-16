const { Route } = require('./route');

class Stop {
    /* Access with stop_code */
    constructor({ id, code, name, lat, lon, routes }) {
        this.id = id
        this.code = code;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.construct_routes(routes);
    };

    construct_routes(routes) {
        /* Create this.routes */
        this.routes = [];
        for (var ID of Object.keys(routes)) {
            this.routes.push(new Route(routes[ID], this.id));
        }
    }

    getRoute({ route_id }) {
        /* Get route using it's number */
        for (var route of this.routes) {
            if (route.id == route_id) {
                return route;
            }
        }
    }

    getNextTrip() {
        return;
    }
};

module.exports = {
    Stop: Stop
};
