import { Document } from "mongoose";

interface Trip extends Document {
    headsign: string;
    direction: number;
    route: string;
    service: string;
    stopTimes: string[];
}

export { Trip };