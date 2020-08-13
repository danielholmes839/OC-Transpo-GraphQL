/* Service Exception MongoDB Model */
import { Schema, Model, model } from 'mongoose';
import { DateModel } from 'api/models';
import { ServiceException } from './types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    date: DateModel,
    removed: { type: Boolean, required: true }
});

export const ServiceExceptionModel: Model<ServiceException> = model<ServiceException>('ServiceException', schema);