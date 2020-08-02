import { Stop } from 'api/types';
import StaticMap from './StaticMap';
import { Position, Size } from './types';


const calculateCenter = (positions: Position[]): Position => {
    let lat = 0;
    let lon = 0;

    for (let position of positions) {
        lat += position.lat;
        lon += position.lon;
    }

    lat /= positions.length;
    lon /= positions.length;
    return { lat, lon }
}


class StaticTravelPlanMap extends StaticMap {
    public constructor(stops: Stop[], size: Size, zoom: number) {
        super(calculateCenter(stops), size, zoom);
        this.addStops(stops);
    }

    public addStops(stops: Stop[]): void {
        for (let i = 0; i < stops.length; i++) {
            this.addMarker('blue', 'mid', i, stops[i].lat, stops[i].lon);
        }

    }
}

export default StaticTravelPlanMap