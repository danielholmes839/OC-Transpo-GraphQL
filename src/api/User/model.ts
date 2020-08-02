import { Schema, Model, model } from 'mongoose';
import { User } from './types';

const schema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favouriteStops: [
        {
            type: Schema.Types.ObjectId,
            ref: 'FavouriteStop'
        }
    ]
});

export const UserModel: Model<User> = model<User>('User', schema);