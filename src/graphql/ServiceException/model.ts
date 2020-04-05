import { Schema, Model, model } from "mongoose";
import { Date } from '../collections';
import { ServiceException } from './types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    date: Date,
    removed: { type: Boolean, required: true }
});

export const ServiceExceptionCollection: Model<ServiceException> = model<ServiceException>('ServiceException', schema);