import { Document } from 'mongoose';

interface User extends Document {
    email: string;
    password: string;
    favouriteStops: string[];
}

export { User };