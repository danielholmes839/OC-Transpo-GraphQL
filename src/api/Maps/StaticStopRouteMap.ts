import { Bus } from 'api/LiveBusData/Bus';
import { Stop } from 'api/types';
import StaticMap from './StaticMap';
import { Size, Position } from './types';


const meters_per_pixel = (latitiude: number, zoom: number): number => {
    // https://groups.google.com/g/google-maps-js-api-v3/c/hDRO4oHVSeM/m/osOYQYXg2oUJ?pli=1
    return 156543.03392 * Math.cos(latitiude * Math.PI / 180) / Math.pow(2, zoom)
}

const calculate_zoom = (pixels: number, distance: number, latitiude: number): number => {
    let zoom = 20; // most zoomed in
    while (zoom !== 10) {
        if ((meters_per_pixel(latitiude, zoom) * pixels) > distance) {
            return zoom;
        }
        zoom -= 1;
    }
}


class StaticStopRouteMap extends StaticMap {
    public constructor(stop: Stop, buses: Bus[], size: Size) {
        buses = buses.filter(bus => bus.gps !== null);
        let zoom = StaticStopRouteMap.zoom(stop, buses, size);
        super(stop, size, zoom);
        this.addStop(stop);
        this.addBuses(buses);
    }

    public static zoom(center: Position, buses: Bus[], size: Size): number {
        console.log(center);
        console.log(buses);
        let max_latitude = 0;
        let max_longitude = 0;

        for (let bus of buses) {
            let d_latitude = Math.abs(bus.gps.lat - center.lat);
            let d_longitude = Math.abs(bus.gps.lon - center.lon);
            if (d_latitude > max_latitude) {
                max_latitude = d_latitude;
            }

            if (d_longitude > max_longitude) {
                max_longitude = d_longitude;
            }

            if (d_latitude > max_latitude) {
                max_latitude = d_latitude;
            }
        }

        let max_distance_height = max_latitude * 111139;
        let max_distance_width = max_longitude * 111139; // meters

        let zoom_width = calculate_zoom(size.width / 2, max_distance_width, center.lat)
        let zoom_height = calculate_zoom(size.height / 2, max_distance_height, center.lat)
        return Math.min(zoom_width, zoom_height);
    }

    public addStop(stop: Stop): void {
        this.addMarker('blue', 'mid', 'S', stop.lat, stop.lon);
    }

    public addBus(bus: Bus, count: number): void {
        this.addMarker('red', 'mid', count, bus.gps.lat, bus.gps.lon);
    }

    public addBuses(buses: Bus[]): void {
        let i = 1;
        for (let bus of buses) {
            this.addBus(bus, i);
            i += 1;
        }
    }
}

export default StaticStopRouteMap