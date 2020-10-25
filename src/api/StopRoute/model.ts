/* Stop Route MongoDB Model */
import { Schema, Model, model } from 'mongoose';
import { StopRoute } from './types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    stop: { type: String, ref: 'Stop' },
    route: { type: String, ref: 'Route' },
    number: { type: String, required: true },
    headsign: { type: String, required: true },
    direction: { type: Number, required: true },
    stopTimes: [{ type: String, ref: 'StopTime' }]
});

export const StopRouteModel: Model<StopRoute> = model<StopRoute>('StopRoute', schema);