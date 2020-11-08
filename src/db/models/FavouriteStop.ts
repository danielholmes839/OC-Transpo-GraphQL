/* Favourite Stop MongoDB Model */
import { Schema, model } from 'mongoose';
import { FavouriteStop } from 'types';

const schema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    stop: { type: String, ref: 'Stop' },
    stopRoutes: [{ type: String, ref: 'StopRoute' }]
});

export default model<FavouriteStop>('FavouriteStop', schema);