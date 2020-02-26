const fs = require('fs');

STOP_TIMES = JSON.parse(fs.readFileSync('../data/STOP_TIMES.json'));
STOPS = JSON.parse(fs.readFileSync('../data/STOPS.json'));
TRIPS = JSON.parse(fs.readFileSync('../data/TRIPS.json'));
ROUTES = JSON.parse(fs.readFileSync('../data/ROUTES.json'));

module.exports = {
    STOP_TIMES: STOP_TIMES,
    STOPS: STOPS,
    TRIPS: TRIPS,
    ROUTES: ROUTES
};