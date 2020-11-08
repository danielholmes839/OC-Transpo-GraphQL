/* Service Exception MongoDB Model */
import { Schema, model } from 'mongoose';
import { ServiceException } from 'types';

const schema: Schema = new Schema({
    _id: { type: String, required: true },
    date: { type: Number, required: true },
    removed: { type: Boolean, required: true }
});

export default model<ServiceException>('ServiceException', schema);