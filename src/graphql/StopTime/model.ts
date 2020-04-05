import { Schema, Model, model } from "mongoose";
import { StopTime } from './types';
import { Time } from "../collections";

const schema: Schema = new Schema({
    _id: {
        type: String,
        required: true
    },

    sequence: {
        type: Number,
        required: true
    },

    time: Time,

    trip: {
        type: String,
        ref: 'Trip'
    },

    stop: {
        type: String,
        ref: 'Stop'
    }
});

export const StopTimeCollection: Model<StopTime> = model<StopTime>('StopTime', schema);