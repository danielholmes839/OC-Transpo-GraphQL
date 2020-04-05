import { Schema, Model, model } from "mongoose";
import { Route } from './types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    number: { type: String, required: true },
    routeType: { type: Number, required: true },
    colour: { type: String, required: false },
    textColour: { type: String, required: false },
    stops: [{ type: String, ref: 'Stop' }],
    trips: [{ type: String, ref: 'Trip' }]
});

export const RouteCollection: Model<Route> = model<Route>('Route', schema);