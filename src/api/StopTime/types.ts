import { Document } from 'mongoose';

interface StopTime extends Document {
    sequence: number;
    time: number;
    stop: string;
    trip: string;
    service: string;
}

export { StopTime };