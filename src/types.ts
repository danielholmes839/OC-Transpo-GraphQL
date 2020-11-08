import { Document } from 'mongoose';


interface Stop extends Document {
    id: string;
    name: string;
    code: string;
    lat: number;
    lon: number;
    routes: string[];           
    stopRoutes: string[];       
}

interface StopRoute extends Document {
    number: string;
    headsign: string;
    direction: number;
    route: string;                              
    stop: string;                               
    stopTimes: string[];                        
}

interface Route extends Document {
    number: string;
    type: number;
    backgroundColour: string;
    textColour: string;
    trips: string[]; 
    stops: string[];
}

interface Service extends Document {
    start: number;
    end: number;
    exceptions: string[];
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

interface ServiceException extends Document {
    date: number;
    removed: boolean;
}

interface StopTime extends Document {
    sequence: number;
    time: number;
    stop: string;
    route: string;
    stopRoute: string;
    trip: string;
    service: string;
    serviceIsNextDay: boolean;
}

interface StopTimeService {
    serviceIsNextDay: boolean
    service: Service
}

interface Trip extends Document {
    headsign: string;
    direction: number;
    route: string;
    service: string;
    stopTimes: string[];
}

interface User extends Document {
    email: string;
    password: string;
    favouriteStops: string[];
}

interface FavouriteStop extends Document {
    user: string;           
    stop: string;
    stopRoutes: string[];
}

enum Day {
    SUNDAY='sunday',
    MONDAY='monday',
    TUESDAY='tuesday',
    WEDNESDAY='wednesday',
    THURSDAY='thursday',
    FRIDAY='friday',
    SATURDAY='saturday'
}


export { Stop, StopRoute, Route, Service, ServiceException, StopTime, StopTimeService, Trip, User, FavouriteStop, Day }
