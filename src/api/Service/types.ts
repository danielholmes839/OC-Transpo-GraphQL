import { Document } from 'mongoose';
import { Date } from 'api/types';

interface Service extends Document {
    start: Date;
    end: Date;
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