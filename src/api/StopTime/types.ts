import { Document } from 'mongoose';

interface StopTime extends Document {
    sequence: number;
    time: number;
    stop: string;
    route: string;
    stopRoute: string;
    trip: string;
    service: string;
}

export { StopTime };