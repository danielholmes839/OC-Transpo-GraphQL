const { Trip } = require('./trip');

class Route {
    /* Stored within array Stop.routes */
    constructor(id, number, name, trips) {
        this.id = id;
        this.number = number;
        this.name = name;
        this.trips = trips
    }


}

module.exports = {
    Route: Route
};
