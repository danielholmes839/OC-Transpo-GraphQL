const fs = require('fs');


module.exports = {
    stopTimes: JSON.parse(fs.readFileSync('../data/STOP_TIMES.json')),
    stops: JSON.parse(fs.readFileSync('../data/STOPS.json')),
    trips: JSON.parse(fs.readFileSync('../data/TRIPS.json')),
    routes: JSON.parse(fs.readFileSync('../data/ROUTES.json')),
    stopRoutes: JSON.parse(fs.readFileSync('../data/STOP_ROUTES.json'))
};