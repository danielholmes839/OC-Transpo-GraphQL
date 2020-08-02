/* Stop MongoDB Model */
import { Schema, Model, model } from 'mongoose';
import { Stop } from './types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    routes: [{ type: String, ref: 'Route' }],
    stopRoutes: [{ type: String, ref: 'StopRoute' }]
});
schema.index({ name: 'text', description: 'text' })
export const StopModel: Model<Stop> = model<Stop>('Stop', schema);

