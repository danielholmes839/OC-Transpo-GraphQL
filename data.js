const { Stop, StopTime, Trip, Route } = require('./types/package');
const fs = require('fs');


function read_stop_times() {
    /* Read STOP_TIMES.json */
    let STOP_TIMES_JSON = JSON.parse(fs.readFileSync('STOP_TIMES.json'));
    let STOP_TIMES = {};

    for (let ID of Object.keys(STOP_TIMES_JSON)) {
        let { trip_id, stop_id, time } = STOP_TIMES_JSON[ID];
        STOP_TIMES[ID] = new StopTime(ID, trip_id, stop_id, time);
    }

    return STOP_TIMES;
}

function read_stops() {
    /* Read STOPS.json */
    let STOPS_JSON = JSON.parse(fs.readFileSync('STOPS.json'));
    let STOPS = {};

    for (let ID of Object.keys(STOPS_JSON)) {
        let { code, name, lat, lon, routes } = STOPS_JSON[ID];
        STOPS[ID] = new Stop(ID, code, name, lat, lon, routes);
    }

    return STOPS;
}

function read_trips() {
    /* Read TRIPS.json */
    let TRIPS_JSON = JSON.parse(fs.readFileSync('TRIPS.json'));
    let TRIPS = {};

    for (let ID of Object.keys(TRIPS_JSON)) {
        let { service_id, route_id, trip_headsign } = TRIPS_JSON[ID];
        TRIPS[ID] = new Trip(ID, service_id, route_id, trip_headsign);
    }

    return TRIPS;
}

module.exports = {
    STOPS_TIMES: read_stop_times(),
    STOPS: read_stops(),
    TRIPS: read_trips()
};
