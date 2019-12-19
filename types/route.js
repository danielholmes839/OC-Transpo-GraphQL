const { Trip } = require('./trip');
const { TRIPS } = require('../data');

const { StopTime } = require('./stoptime');
const { STOP_TIMES } = require('../data');

function binarySearchStopTimes(stop_times, time) {
    var s = 0;
    var e = stop_times.length-1;
    var m = e//2;

    while (s !== e) {
        if (stop_times[m].time < time) {
            e = m;
        }
        
        else {
            s = m;
        }
        m //= 2;
    }

    return stop_times[s];
}

class Route {
    /* Stored within array Stop.routes */
    constructor({ id, number, name, type, type_number, colour, text_colour, trips }, stop_id) {
        this.id = id;
        this.stop_id = stop_id;
        this.number = number;
        this.name = this.getName(stop_id, trips);
        this.type = type;
        this.type_number = type_number;
        this.colour = colour;
        this.text_colour = text_colour;
        this.trips = trips;
    }

    getName(stop_id, trips_ids) {
        for (var trip_id of trips_ids) {
            // Should only run atleast twice
            var stop_time = STOP_TIMES[`${trip_id}-${this.stop_id}`];
            if (stop_time) {
                return TRIPS[trip_id].trip_headsign;
            }
        }
        // Backup although I dont see how it could happen
        return TRIPS[trip_ids[0]].trip_headsign;
    }

    getTrips() {
        var trips = [];
        for (var trip_id of this.trips) {
            var stop_time = STOP_TIMES[`${trip_id}-${this.stop_id}`];
            if (stop_time) {
                trips.push(new Trip(TRIPS[trip_id]));
            }
        }
        return trips;
    }

    getNextStopTime() {
        var stop_times = this.getStopTimes(); 
        var time = new Date().toTimeString().substring(0, 5);
        for (var stop_time of stop_times) {
            if (time < stop_time.time) {
                return stop_time;
            } 
        }
        return stop_times[0];
    }


    getStopTimes() {
        var stop_times = [];
        for (var trip_id of this.trips) {
            var stop_time = STOP_TIMES[`${trip_id}-${this.stop_id}`];
            if (stop_time) {
                stop_times.push(new StopTime(stop_time));
            }
        }
        return stop_times;
    }
}

module.exports = {
    Route: Route
};
