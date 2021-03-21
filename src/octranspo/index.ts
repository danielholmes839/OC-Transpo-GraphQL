// import Bus from './Bus';
// import BusAPI from './API';

// let API = new BusAPI();

// export { Bus, API }
import NodeCache from 'node-cache';
import axios, { AxiosRequestConfig } from 'axios';
import { Response, ResponseRoute, ResponseTrip, Bus, LiveData } from './types'
import { Stop, StopRoute } from 'types';

const processTrips = (route: ResponseRoute): ResponseTrip[] => {
    // Clean up the ridiculous 4 options of trip format from the OC Transpo API
    if (Array.isArray(route.Trips)) {
        return route.Trips;
    } else if (typeof route.Trips === 'object' && route.Trips.hasOwnProperty('Trip')) {
        route.Trips = <{ Trip: any }>route.Trips;
        if (Array.isArray(route.Trips.Trip)) {
            return route.Trips.Trip;
        } else {
            return [route.Trips.Trip];
        }
    } else {
        return [<ResponseTrip>route.Trips];
    }
}

const processResponse = (response: Response, stop: Stop): LiveData => {
    let data: LiveData = {};
    let routes = response.GetRouteSummaryForStopResult.Routes.Route;

    if (!Array.isArray(routes)) {
        routes = [routes];
    }

    routes.filter(route => route != null).forEach(route => {
        let trips: ResponseTrip[]  = processTrips(route);

        let buses: Bus[]  = trips.filter(route => route != null).map(trip => {
            // Create the Bus
            let date = new Date();
            let currentTime = (date.getHours() * 60) + date.getMinutes();
            let arrivalTime = (currentTime + parseInt(trip.AdjustedScheduleTime)) % 1440;

            let onSchedule = parseInt(trip.AdjustmentAge) === -1;
            let lastUpdated = (onSchedule) ? null : parseInt(trip.AdjustmentAge);
            let latitude = parseFloat(trip.Latitude);
            let longitude = parseFloat(trip.Longitude);

            let bus: Bus = {
                arrivalTime: arrivalTime,
                arrivalTimeLastUpdated: lastUpdated,
                arrivalTimeOnSchedule: onSchedule,
                latitude: isNaN(latitude) ? null : latitude,
                longitude: isNaN(longitude) ? null : longitude,
                distance: null,
                hasPosition: !(isNaN(latitude) || isNaN(latitude))
            }

            if (bus.hasPosition) {
                bus.distance = Math.sqrt(Math.pow(stop.lat - bus.latitude, 2) + Math.pow(stop.lon - bus.longitude, 2)) * 111.139;
            }

            return bus
        });

        data[route.RouteNo] = buses;
    });

    return data
}

class OCTranspoAPI {
    cache: NodeCache;

    constructor() {
        this.cache = new NodeCache({ stdTTL: 30 })
    }

    async request(stop: Stop): Promise<LiveData> {
        let config: AxiosRequestConfig = {
            method: 'get',
            url: 'https://api.octranspo1.com/v2.0/GetNextTripsForStopAllRoutes',
            responseType: 'json',
            params: {
                appID: process.env.appID,
                apiKey: process.env.apiKey,
                format: 'json',
                stopNo: stop.code
            }
        }

        let reponse = await axios.get(config.url, config);
        let data: Response = reponse.data;

        return processResponse(data, stop);
    }

    async get(stop: Stop, stopRoute: StopRoute): Promise<Bus[]> {
        if (!this.cache.has(stop.code)) {
            let data = this.request(stop);
            this.cache.set(stop.code, data)
        }

        let buses = (await this.cache.get(stop.code))[stopRoute.number];
        return (buses == null) ? [] : buses;
    }
}

let API = new OCTranspoAPI();

export { Bus, API }
