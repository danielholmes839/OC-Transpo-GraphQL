import { Document } from 'mongoose';

interface ServiceException extends Document {
    date: number;
    removed: boolean;
}

export { ServiceException };