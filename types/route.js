const { Trip } = require('./trip');
const { TRIPS } = require('../data');
const { StopTime } = require('./stoptime');
const { STOP_TIMES } = require('../data');


class Route {
    /* Stored within array Stop.routes */
    constructor(id, stop_id, number, name, trips) {
        this.id = id;
        this.stop_id = stop_id
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
        var stop_times = [];

        for (var trip_id of this.trips) {
            
            var stop_time = STOP_TIMES[`${trip_id}-${this.stop_id}`];

            if (stop_time) {
                var { id, trip_id, stop_id, time } = stop_time;
                stop_times.push(new StopTime(id, trip_id, stop_id, time));
        
            }
        }
        return stop_times;
    }
}

module.exports = {
    Route: Route
};
