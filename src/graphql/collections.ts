import { Schema } from 'mongoose';
/* Subdocuments */
const Date: Schema = new Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true }
});

const Time: Schema = new Schema({
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
    int: { type: Number, required: true }
});

import { FavouriteStopCollection } from './FavouriteStop/model';
import { UserCollection } from './User/model';
import { StopCollection } from './Stop/model';
import { StopRouteCollection } from './StopRoute/model';
import { RouteCollection } from './Route/model';
import { StopTimeCollection } from './StopTime/model';
import { TripCollection } from './Trip/model';
import { ServiceCollection } from './Service/model';
import { ServiceExceptionCollection } from './ServiceException/model';

export {
    Date, Time, UserCollection, FavouriteStopCollection, StopCollection, StopRouteCollection,
    RouteCollection, StopTimeCollection, TripCollection, ServiceCollection, ServiceExceptionCollection
};