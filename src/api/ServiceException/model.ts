/* Service Exception MongoDB Model */
import { Schema, Model, model } from 'mongoose';
import { ServiceException } from './types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    date: { type: Number, required: true },
    removed: { type: Boolean, required: true }
});

export const ServiceExceptionModel: Model<ServiceException> = model<ServiceException>('ServiceException', schema);