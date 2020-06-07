/* Favourite Stop MongoDB Model */
import { Schema, Model, model } from "mongoose";
import { FavouriteStop } from './types';

const schema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    stop: { type: String, ref: 'Stop' },
    stopRoutes: [{ type: String, ref: 'StopRoute' }]
});

export const FavouriteStopCollection: Model<FavouriteStop> = model<FavouriteStop>('FavouriteStop', schema);