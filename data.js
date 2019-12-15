const fs = require('fs');

STOP_TIMES = JSON.parse(fs.readFileSync('STOP_TIMES.json'));
STOPS = JSON.parse(fs.readFileSync('STOPS.json'));
TRIPS = JSON.parse(fs.readFileSync('TRIPS.json'));

module.exports = {
    STOP_TIMES: STOP_TIMES,
    STOPS: STOPS,
    TRIPS: TRIPS
};