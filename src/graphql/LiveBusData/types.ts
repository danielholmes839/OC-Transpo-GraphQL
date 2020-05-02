import { Bus } from './Bus';
/*
    Types for OC Transpo's API for getting GPS data
    It does a lot of weird things
    By default it is XML but it can be parsed to json with a request parameter
    Maybe some of the issues are from it converting XML to JSON

*/
type OCTranspoResponse = {
    StopNo: string;
    StopDescription: string;                            // Seems to match stop name in GTFS 
    Error: string;
    Routes: {                                           // Only one subfield                                    
        Route: OCTranspoRoute | OCTranspoRoute[];       // Object or list of objects
    }
}

type OCTranspoRoute = {
    RouteNo: string;
    RouteHeading: string;
    Direction: string;
    DirectionID: number;
    Trips: {                                            // Again another nested object with only one field
        Trip: OCTranspoTrip | OCTranspoTrip[];          // Object or list of objects
    }             
}

type OCTranspoTrip = {
    RouteHeading: string;                               // Matches trip headsign in GTFS
    RouteNo: string;                                    // Matches route number in GTFS
    DirectionID: number;
    AdjustedScheduleTime: string;                       // Minutes after trip start the bus will arrive
    AdjustmentAge: string;                              // Time in minutes since the AdjustedScheduleTime was changed. -1 means on schedule
    TripStartTime: string;                              // TripStartTime + AdjustedScheduleTime is when the bus will arrive. This could be done much better
    LastTripOfSchedule: boolean;
    BusType: string;
    Latitude: string;                                   // sometimes empty string???    maybe the bus is broken
    Longitude: string                                   // sometimes empty string???    maybe the api is broken
    GPSSpeed: string;                                   // sometimes empty string???    maybe there should be feedback 
}

type StopCodeKV = { [key: string]: Bus[] }

export {
    OCTranspoResponse, OCTranspoRoute, OCTranspoTrip, StopCodeKV
}