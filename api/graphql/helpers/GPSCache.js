const NodeCache = require('node-cache');
const axios = require('axios').default;

class GPSCache {
    constructor() {
        this.routeCache = new NodeCache({ stdTTL: 90 });
        this.stopCache = new NodeCache({ stdTTL: 90 });
    }

    async requestGPS(code) {
        /* Requests GPS data from OC Transpo */
        const request = {
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
        const response = await axios(request);
        console.log("did request");
        return this.processGPS(response.data);


    }

    processGPS(data) {
        /*
        Set values in caches to be lists of bus
        bus: {
            lat, lon, speed, direction, headsign
        }
        */
        let routes = {}
        if (data.GetRouteSummaryForStopResult.Routes.Route.length == undefined) {
            data.GetRouteSummaryForStopResult.Routes.Route = [data.GetRouteSummaryForStopResult.Routes.Route];
        }

        for (let r of data.GetRouteSummaryForStopResult.Routes.Route) {
            let number = r.RouteNo;
            if (!routes.hasOwnProperty(number)) {
                routes[number] = []
            }

            if (r.Trips.length == undefined) {
                r.Trips = [r.Trips];
            }

            for (let trip of r.Trips) {

                let bus = {
                    lat: parseFloat(trip.Latitude),
                    lon: parseFloat(trip.Longitude),
                    speed: parseFloat(trip.GPSSpeed),
                    headsign: r.RouteHeading,
                    direction: r.DirectionID,
                }


                if (!isNaN(bus.lat) && !isNaN(bus.lon) && !isNaN(bus.speed)) {
                    routes[number].push(bus);
                }
            }
        }

        for (let number of Object.keys(routes)) {
            this.routeCache.set(number, routes[number]);
        }
        return routes;
    }

    async getStopData(stopCode) {
        if (!this.stopCache.has(stopCode)) {
            this.stopCache.set(stopCode, this.requestGPS(stopCode));
        }
        return this.stopCache.get(stopCode);
    }

    async getRouteData(stopCode, routeNumber) {
        if (this.routeCache.has(routeNumber)) {
            return this.routeCache.get(routeNumber);
        }

        else if (!this.stopCache.has(stopCode)) {
            this.stopCache.set(stopCode, this.requestGPS(stopCode));
        }

        const data = await this.stopCache.get(stopCode)
        if (!data.hasOwnProperty(routeNumber)) {
            return [];
        }
        return data[routeNumber];
    }
}


module.exports = new GPSCache();
