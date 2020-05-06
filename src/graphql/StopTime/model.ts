import { Schema, Model, model } from "mongoose";
import { StopTime } from './types';

const schema: Schema = new Schema({
    _id: {
        type: String,
        required: true
    },

    sequence: {
        type: Number,
        required: true
    },

    time: {
        type: Number,
        required: true
    },

    stop: {
        type: String,
        ref: 'Stop'
    },

    trip: {
        type: String,
        ref: 'Trip'
    },

    service: {
        type: String,
        ref: 'Service'
    }
});

export const StopTimeCollection: Model<StopTime> = model<StopTime>('StopTime', schema);