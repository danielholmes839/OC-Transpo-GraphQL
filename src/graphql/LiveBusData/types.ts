import { Bus } from './bus';
/*
    Types for OC Transpo's API for getting GPS data
    It does a lot of weird things
    By default it is XML but it can be parsed to json with a request parameter
    Maybe some of the issues are from it converting XML to JSON

*/
type OCTranspoResponse = {
    StopNo: string;
    StopDescription: string;                            // Matches stop name in GTFS    maybe it should be named StopName 
    Error: string;
    Routes: {                                           // Has only one subfield???     maybe dont                                    
        Route: OCTranspoRoute | OCTranspoRoute[];       // Can be a list or not???      maybe it should always be a list
    }
}

type OCTranspoRoute = {
    RouteNo: string;
    RouteHeading: string;
    Direction: string;
    DirectionID: number;
    Trips: OCTranspoTrip | OCTranspoTrip[];             // Can be a list or not???      maybe it should always be a list
}

type OCTranspoTrip = {
    RouteHeading: string;
    RouteNo: string;
    DirectionID: number;
    AdjustedScheduleTime: string;
    AdjustmentAge: string;
    TripStartTime: string;
    LastTripOfSchedule: boolean;
    BusType: string;
    Latitude: string;                                   // sometimes empty string???    maybe the bus is broken
    Longitude: string                                   // sometimes empty string???    maybe the api is broken
    GPSSpeed: string;                                   // sometimes empty string???    maybe there should be feedback 
}

type StopCodeKV = {[key: string]: Bus[]}

export {
    OCTranspoResponse, OCTranspoRoute, OCTranspoTrip, StopCodeKV
}