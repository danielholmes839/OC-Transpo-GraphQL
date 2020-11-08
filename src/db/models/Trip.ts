import { Schema, model } from 'mongoose';
import { Trip } from 'types';

const schema: Schema = new Schema({
    _id: {
        type: String,
        required: true
    },

    headsign: {
        type: String,
        required: true
    },

    direction: {
        type: Number,
        required: true
    },

    route: {
        type: String,
        ref: 'Route'
    },

    service: {
        type: String,
        ref: 'Service'
    },

    stopTimes: [
        {
            type: String,
            ref: 'StopTime'
        }
    ]
});

export default model<Trip>('Trip', schema);