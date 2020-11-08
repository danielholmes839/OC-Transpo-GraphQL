/* Gross functions to deal with inconsistent responses */
import Bus from './Bus';
import { Stop } from 'types';
import { StopData, OCTranspoResponse, OCTranspoRoute, OCTranspoTrip } from './types';


const getRoutes = (data: OCTranspoResponse): OCTranspoRoute[] => {
    if (!Array.isArray(data.Routes.Route)) {
        // Routes is not a list
        return [data.Routes.Route];
    } else {
        return data.Routes.Route;
    }
}

const getTrips = (route: OCTranspoRoute): OCTranspoTrip[] => {
    if (Array.isArray(route.Trips)) {
        return route.Trips;
    } else if (typeof route.Trips === 'object' && route.Trips.hasOwnProperty('Trip')) {
        route.Trips = <{ Trip: any }>route.Trips;
        if (Array.isArray(route.Trips.Trip)) {
            return <OCTranspoTrip[]>route.Trips.Trip;
        } else {
            return <OCTranspoTrip[]>[route.Trips.Trip];
        }

    } else {
        return [<OCTranspoTrip>route.Trips];
    }
}

const process = (stop: Stop, data: OCTranspoResponse): StopData => {
    let liveStopData: StopData = {} // This object will be cached

    try {
        if (data == null) {
            // Could not access OC Transpo so return an empty object
            console.log('Could not access OC Transpo');
            return liveStopData;
        }

        const routes: OCTranspoRoute[] = getRoutes(data);
        for (let route of routes) {
            if (route == null) {
                continue;
            }
            const routeNumber = route.RouteNo;
            const trips: OCTranspoTrip[] = getTrips(route);
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
    } catch (e) {
        console.log(e);
    }
    return liveStopData;
}

export default process