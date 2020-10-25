import { Document } from 'mongoose';

interface Service extends Document {
    start: number;
    end: number;
    exceptions: string[]; // ref
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export { Service };