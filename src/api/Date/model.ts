import { Schema } from 'mongoose';

/* Subdocuments */
export const DateModel: Schema = new Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true }
});
