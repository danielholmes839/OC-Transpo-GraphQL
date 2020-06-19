import { Stop } from "../types";
import { OCTranspoTrip, OCTranspoRoute } from "./types";


class GPS {
    public lat: number;
    public lon: number;
    public speed: number;
    public distance: number;
    public valid: boolean;

    public constructor(trip: OCTranspoTrip, destination: Stop) {
        this.lat = GPS.parseFloat(trip.Latitude);
        this.lon = GPS.parseFloat(trip.Longitude);
        this.speed = GPS.parseFloat(trip.GPSSpeed);
        this.valid = true;

        if (this.lat == null || this.lon == null) {
            this.valid = false;
        }
        this.distance = Math.sqrt(Math.pow(destination.lat - this.lat, 2) + Math.pow(destination.lon - this.lon, 2)) * 111.139;
    }

    public static create(trip: OCTranspoTrip, destination: Stop): GPS | null {
        let gps = new GPS(trip, destination);
        return (gps.valid ? gps : null);
    }

    private static parseFloat(n: string): number {
        let value = parseFloat(n);
        if (isNaN(value)) return null;
        return value;
    }
}


class Bus {
    public headsign: string
    public number: string
    public direction: number

    public gps: GPS | null      // Sometimes there's no GPS data
    public arrival: number      // The time the bus will arrive at the stop
    public onTime: boolean

    public constructor(trip: OCTranspoTrip, route: OCTranspoRoute, destination: Stop) {
        this.headsign = route.RouteHeading;
        this.number = route.RouteNo;
        this.direction = route.DirectionID;
        this.gps = GPS.create(trip, destination);
        this.arrival = this.getTime(trip);
    }

    private getTime(trip: OCTranspoTrip): number {
        let [h, m] = trip.TripStartTime.split(':');
        let int = (parseInt(h) * 60 + parseInt(m) + parseInt(trip.AdjustedScheduleTime)) % 1440;
        return int;
    }

    private getOnTime(trip: OCTranspoTrip) {
        return parseInt(trip.AdjustedScheduleTime) < 0;
    }
}

export {
    Bus
}