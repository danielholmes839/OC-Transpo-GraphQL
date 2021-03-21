type Response = {
    GetRouteSummaryForStopResult: {
        StopNo: string;
        Error: string;
        StopDescription: string;
        Routes: {
            Route: ResponseRoute | ResponseRoute[] | null;
        }  
    };
}

type ResponseRoute = {
    RouteNo: string;
    RouteHeading: string;
    DirectionID: number;
    Direction: string;
    Trips: { Trip: ResponseTrip | ResponseTrip[]} | ResponseTrip | ResponseTrip[] | null;
}

type ResponseTrip = {
    Latitude: string;                                   // sometimes empty string???    maybe the bus is broken
    Longitude: string                                   // sometimes empty string???    maybe the api is broken
    GPSSpeed: string;                                   // sometimes empty string???    maybe there should be feedback 
    TripDestination: string;
    TripStartTime: string;                              
    AdjustedScheduleTime: string;                       
    AdjustmentAge: string;                              
    LastTripOfSchedule: boolean;
    BusType: string;   
}

type Bus = {
    latitude: number | null;
    longitude: number | null;
    distance: number | null
    arrivalTime: number;
    arrivalTimeOnSchedule: boolean;
    arrivalTimeLastUpdated: number | null;
    hasPosition: boolean;
}

type LiveData = { [RouteNo: string]: Bus[] }

export { Response, ResponseRoute, ResponseTrip, Bus, LiveData }