const axios = require('axios').default;

const { Route, StopRoute } = require('../../models/index');
const { populateMany, docId } = require('./loaders');

const argument = (name, value) => {
    return `${name}`
}

const resolvers = {
    Stop: {
        id: docId,
        routes: async ({ routes }, args, context) => {
            return await populateMany(routes, Route);
        },
        stopRoutes: async ({ stopRoutes }, args, context) => {
            return await populateMany(stopRoutes, StopRoute);
        },

        gpsData: async ({ code, stopRoutes }, args, context) => {
            const config = {
                method: 'get',
                url: 'https://api.octranspo1.com/v1.3/GetNextTripsForStopAllRoutes',
                responseType: 'json',
                params: {
                    appID: process.env.appID,
                    apiKey: process.env.apiKey,
                    format: 'json',
                    stopNo: code
                }
            }

            const response = await axios(config);

            let gps = []

            for (let route of response.data.GetRouteSummaryForStopResult.Routes.Route) {
                routeGPS = {
                    number: route.RouteNo,
                    headsign: route.RouteHeading,
                    positions: []
                }

                if (route.Trips.length == undefined) {
                    route.Trips = [route.Trips]
                }

                for (let trip of route.Trips) {
                    let position = {
                        lat: parseFloat(trip.Latitude),
                        lon: parseFloat(trip.Longitude),
                        speed: parseFloat(trip.GPSSpeed)
                    }
                    if (!isNaN(position.lat) && !isNaN(position.lon) && !isNaN(position.speed)) {
                        routeGPS.positions.push(position);
                    }
                }

                if (routeGPS.length !== 0) {
                    gps.push(routeGPS);
                }
            }

            return gps;
        }
    }
}

module.exports = resolvers;