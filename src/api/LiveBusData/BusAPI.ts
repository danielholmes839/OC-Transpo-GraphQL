import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { Bus } from './Bus';
import { BusCache } from './BusCache';
import { OCTranspoResponse, OCTranspoRoute, OCTranspoTrip, StopDataKV } from './types';
import { Stop } from 'api/types';
import { StopRoute } from 'api/StopRoute/types';


class BusAPI {
    base: AxiosRequestConfig;
    api: AxiosInstance;
    cache: BusCache

    constructor() {
        this.base = {
            method: 'get',
            url: 'https://api.octranspo1.com/v1.3/GetNextTripsForStopAllRoutes',
            responseType: 'json',
            params: {
                appID: process.env.appID,
                apiKey: process.env.apiKey,
                format: 'json',
                stopNo: ''
            }
        }
        this.cache = new BusCache();
        this.api = axios.create();
    }

    private createConfig(stopCode: string): AxiosRequestConfig {
        // creates the config for the request
        let config: AxiosRequestConfig = Object.assign(this.base);
        config.params.stopNo = stopCode;
        return config;
    }

    private async request(stopCode: string): Promise<OCTranspoResponse> {
        // requests the new live bus data and return the value to be cached
        let config = this.createConfig(stopCode);
        let response: AxiosResponse = await this.api.get(config.url, config)
        let data: OCTranspoResponse = response.data.GetRouteSummaryForStopResult;
        return data;
    }

    private getRoutes(data: OCTranspoResponse): OCTranspoRoute[] {
        if (!Array.isArray(data.Routes.Route)) {
            // Routes is not a list
            return [data.Routes.Route];
        } else {
            return data.Routes.Route;
        }
    }
    private getTrips(route: OCTranspoRoute): OCTranspoTrip[] {
        if (Array.isArray(route.Trips)) {
            return route.Trips;
        } else if (typeof route.Trips === 'object' && route.Trips.hasOwnProperty('Trip')) {
            return (<{ Trip: OCTranspoTrip[] }>route.Trips).Trip;
        } else {
            return [<OCTranspoTrip>route.Trips];
        }
    }
    private async getLiveStopData(stop: Stop): Promise<StopDataKV> {
        // creates the value to be cached
        let data: OCTranspoResponse = await this.request(stop.code);
        console.log(JSON.stringify(data));
        let liveStopData: StopDataKV = {} // This object will be cached

        if (data == null) {
            // Could not access OC Transpo so return an empty object
            console.log('Could not access OC Transpo');
            return liveStopData;
        }

        const routes: OCTranspoRoute[] = this.getRoutes(data);
        for (let route of routes) {
            if (route == null) {
                continue;
            }
            const routeNumber = route.RouteNo;
            const trips: OCTranspoTrip[] = this.getTrips(route);
            if (!liveStopData.hasOwnProperty(routeNumber)) {
                // Make an array to store buses for this route
                liveStopData[routeNumber] = [];
            }

            for (let trip of trips) {
                // Bus is created for every trip
                if (trip == null) {
                    continue;
                }
                liveStopData[routeNumber].push(new Bus(trip, route, stop));
            }
        }
        return liveStopData;
    }

    public async get(stop: Stop, stopRoute: StopRoute): Promise<Bus[]> {
        // Get the data for the next 3 buses of a route heading toward that stop
        if (!this.cache.has(stop.code)) {
            console.log(`OC Transpo API called ${stop.code}`);
            this.cache.store(stop.code, this.getLiveStopData(stop));                                           // update the cache
        } else {
            console.log(`OC Transpo Cache STOP:${stop.code} ROUTE:${stopRoute.number}`);
        }

        let buses: Bus[] = (await this.cache.get(stop.code))[stopRoute.number];                         // await then get the buses for the route
        if (buses == null) buses = [];                                                                  // empty array if there's no buses
        return buses.filter((bus) => bus.direction === stopRoute.direction);
    }
}

export default new BusAPI();