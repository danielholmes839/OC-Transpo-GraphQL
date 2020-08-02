import { Bus } from 'api/LiveBusData/Bus';
import { Stop } from 'api/types';
import StaticMap from './StaticMap';
import { Size } from './types';



class StaticStopRouteMap extends StaticMap {
    public constructor(stop: Stop, buses: Bus[], size: Size, zoom: number) {
        super(stop, size, zoom);
        this.addStop(stop);
        for (let bus of buses) {
            if (bus.gps !== null) this.addBus(bus);
        }
    }

    public addBus(bus: Bus): void {
        this.addMarker('red', 'mid', bus.direction.toString(), bus.gps.lat, bus.gps.lon);
    }

    public addStop(stop: Stop): void {
        this.addMarker('blue', 'mid', 'S', stop.lat, stop.lon);
    }
}

export default StaticStopRouteMap