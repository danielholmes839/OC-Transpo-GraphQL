import { Position, Size } from './types';

class StaticMap {
    protected url: string;
    protected constructor(center: Position, size: Size) {
        this.url = `https://maps.googleapis.com/maps/api/staticmap?key=${process.env.maps}`;
        this.addParameter('center', `${center.lat},${center.lon}`);
        this.addParameter('size', `${size.width}x${size.height}`);
    }

    public addParameter(name: string, value: string): void {
        this.url += `&${name}=${value}`;
    }

    public addMarker(colour: string, size: string, label: string, lat: number, lon: number): void {
        this.url += `&markers=color:${colour}|size:${size}|label:${label}|${lat},${lon}`;
    }

    public serialize(): string {
        return encodeURI(this.url);
    }
}

export default StaticMap