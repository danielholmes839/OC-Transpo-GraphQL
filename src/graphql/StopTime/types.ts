import { Document } from "mongoose";
import { Time } from '../types'

interface StopTime extends Document {
    sequence: number;
    time: Time;
    trip: string;
    stop: string;
    route: string;
}

export { StopTime };