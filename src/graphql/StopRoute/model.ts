import { Schema, Model, model } from "mongoose";
import { StopRoute } from './types';

const schema: Schema = new Schema({
    _id: {
        type: String,
        required: true
    },

    number: {
        type: String,
        required: true
    },

    headsign: {
        type: String,
        required: true
    },

    route: {
        type: String,
        ref: 'Route'
    },

    stop: {
        type: String,
        ref: 'Stop'
    },

    stopTimes: [
        {
            type: String,
            ref: 'StopTime'
        }
    ]
});

export const StopRouteCollection: Model<StopRoute> = model<StopRoute>('StopRoute', schema);