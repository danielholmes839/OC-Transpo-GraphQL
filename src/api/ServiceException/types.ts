import { Document } from 'mongoose';
import { Date } from 'api/types';

interface ServiceException extends Document {
    date: Date;
    removed: boolean;
}

export { ServiceException };