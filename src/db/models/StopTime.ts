/* Stop Time MongoDB Model */
import { Schema, model } from 'mongoose';
import { StopTime } from 'types';

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

    route: {
        type: String,
        ref: 'Route'
    },

    stopRoute: {
        type: String,
        ref: 'StopRoute'
    },

    trip: {
        type: String,
        ref: 'Trip'
    },

    service: {
        type: String,
        ref: 'Service'
    },

    serviceIsNextDay: {
        type: Boolean,
        required: true
    }
});

export default model<StopTime>('StopTime', schema);