import { Schema, model } from 'mongoose';
import { User } from 'types';

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

export default model<User>('User', schema);