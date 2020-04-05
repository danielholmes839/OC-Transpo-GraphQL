import { Document } from "mongoose";
import { Date } from '../types';

interface ServiceException extends Document { 
    date: Date;
    removed: true;
}

export { ServiceException };