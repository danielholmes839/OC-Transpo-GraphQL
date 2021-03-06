/* Route MongoDB Model */
import { Schema, model } from 'mongoose';
import { Route } from 'types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    number: { type: String, required: true },
    type: { type: Number, required: true },
    backgroundColour: { type: String, required: false },
    textColour: { type: String, required: false },
    stops: [{ type: String, ref: 'Stop' }],
    trips: [{ type: String, ref: 'Trip' }]
});

export default model<Route>('Route', schema);