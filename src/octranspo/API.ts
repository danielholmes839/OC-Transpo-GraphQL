import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

import Bus from './Bus';
import Cache from './Cache';
import { Stop, StopRoute } from 'types';
import { StopData } from './types';
import processFn from './process';

class API {
    api: AxiosInstance;
    cache: Cache

    constructor() {
        this.cache = new Cache();
        this.api = axios.create();
    }

    private configuration(code: string): AxiosRequestConfig {
        // creates the config for the request
        return {
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
    }

    private async request(stop: Stop): Promise<StopData> {
        // creates the value to be cached
        let config = this.configuration(stop.code);
        let response = await this.api.get(config.url, config)
        return processFn(stop, response.data.GetRouteSummaryForStopResult);
    }

    public async get(stop: Stop, stopRoute: StopRoute): Promise<Bus[]> {
        // Get the data for the next 3 buses of a route heading toward that stop
        if (!this.cache.has(stop.code)) {
            console.log(`OC Transpo API called STOP:${stop.code}`);
            this.cache.store(stop.code, this.request(stop));                                           // update the cache
        }

        let buses: Bus[] = (await this.cache.get(stop.code))[stopRoute.number];                         // await then get the buses for the route
        if (buses == null) buses = [];                                                                  // empty array if there's no buses
        return buses.filter((bus) => bus.direction === stopRoute.direction);
    }
}

export default API;