const { Trip } = require('./trip');
const { TRIPS } = require('../data');

const { StopTime } = require('./stoptime');
const { STOP_TIMES } = require('../data');


class Route {
    /* Stored within array Stop.routes */
    constructor({ id, number, name, trips }, stop_id) {
        this.id = id;
        this.stop_id = stop_id
        this.number = number;
        this.name = name;
        this.trips = trips
    }

    getTrips() {
        var trips = [];
        for (var trip_id of this.trips) { ;
            trips.push(new Trip(TRIPS[trip_id]));
        }
        return trips;
    }

    getStopTimes() {
        var stop_times = [];
        for (var trip_id of this.trips) {
            stop_times.push(new StopTime(STOP_TIMES[`${trip_id}-${this.stop_id}`]));
        }
        return stop_times;
    }
}

module.exports = {
    Route: Route
};
