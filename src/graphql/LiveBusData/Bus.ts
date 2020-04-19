import { Stop, Time } from "../types";
import { OCTranspoTrip, OCTranspoRoute } from "./types";

class Bus {
    public headsign: string
    public number: string
    public direction: number
    public type: string
    public last: boolean;       // Last bus of schedule

    // Sometimes there's no GPS data
    public lat?: number
    public lon?: number
    public speed?: number
    public distance?: number    // Distance from stop in km
    public hasGPS: boolean;
    // Time
    public arrival: Time        // The time the bus will arrive at the stop     
    public adjusted: boolean;   // Arrival time was adjusted 

    public constructor(trip: OCTranspoTrip, route: OCTranspoRoute, destination: Stop) {
        this.headsign = route.RouteHeading;
        this.number = route.RouteNo;
        this.direction = route.DirectionID;
        this.type = trip.BusType;
        this.lat = this.parseFloat(trip.Latitude);
        this.lon = this.parseFloat(trip.Longitude);
        this.speed = this.parseFloat(trip.GPSSpeed);
        this.hasGPS = this.hasPosition();
        this.setDistance(destination);
        this.setArrival(trip);
        this.setAdjusted(trip);
        this.last = trip.LastTripOfSchedule;
    }

    private parseFloat(n: string): number {
        let v = parseFloat(n);
        if (isNaN(v)) return null;
        return v;
    }

    public hasPosition(): boolean {
        return this.lat != null && this.lon != null;
    }

    private setDistance(destination: Stop): void {
        if (!this.hasGPS) return;
        this.distance = Math.sqrt(Math.pow(destination.lat - this.lat, 2) + Math.pow(destination.lon - this.lon, 2)) * 111.139;
        
    }

    private setArrival(trip: OCTranspoTrip): void {
        let [h, m] = trip.TripStartTime.split(':');
        let int: number = (parseInt(h) * 60 + parseInt(m) + parseInt(trip.AdjustedScheduleTime)) % 1440;
        let hour: number = Math.floor(int / 60) % 24;
        let minute: number = int % 60;
        this.arrival = { hour, minute, int };
    }

    private setAdjusted(trip: OCTranspoTrip) {
        this.adjusted = parseInt(trip.AdjustedScheduleTime) < 0;
    }
}

export {
    Bus
}