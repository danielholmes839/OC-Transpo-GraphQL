const fs = require('fs');

STOP_TIMES = JSON.parse(fs.readFileSync('preprocessing/STOP_TIMES.json'));
STOPS = JSON.parse(fs.readFileSync('preprocessing/STOPS.json'));
TRIPS = JSON.parse(fs.readFileSync('preprocessing/TRIPS.json'));
ROUTES = JSON.parse(fs.readFileSync('preprocessing/ROUTES.json'));

module.exports = {
    STOP_TIMES: STOP_TIMES,
    STOPS: STOPS,
    TRIPS: TRIPS,
    ROUTES: ROUTES
};