import StaticMap from './StaticMap';
import { Bus } from '../LiveBusData/bus';
import { Stop } from '../types';
import { Size } from './types';

class StaticStopRouteMap extends StaticMap {
    public constructor(stop: Stop, buses: Bus[], size: Size) {
        super(stop, size);
        this.addStop(stop);
        for (let bus of buses) {
            if (bus.hasPosition) this.addBus(bus);
        }
    }

    public addBus(bus: Bus): void {
        this.addMarker('red', 'mid', bus.direction.toString(), bus.lat, bus.lon);
    }

    public addStop(stop: Stop): void {
        this.addMarker('blue', 'mid', 'S', stop.lat, stop.lon);
    }
}

export default StaticStopRouteMap