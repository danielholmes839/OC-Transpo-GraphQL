const { Trip } = require('./trip');
const { TRIPS } = require('../data');

class Route {
    /* Stored within array Stop.routes */
    constructor(id, number, name, trips) {
        this.id = id;
        this.number = number;
        this.name = name;
        this.trips = trips
    }

    getTrips() {
        var trips = [];
        for (var trip_id of this.trips) {
            var { id, service_id, route_id, trip_headsign } = TRIPS[trip_id];
            trips.push(new Trip(id, service_id, route_id, trip_headsign));
        }
        return trips;
    }

    getStopTimes() {

    }
}

module.exports = {
    Route: Route
};
