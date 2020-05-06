import { Document } from "mongoose";
import { Time } from '../types'

interface StopTime extends Document {
    sequence: number;
    time: number;
    stop: string;
    trip: string;
    service: string;
}

export { StopTime };