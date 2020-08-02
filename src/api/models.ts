import { Schema } from 'mongoose';
/* Subdocuments */
const Date: Schema = new Schema({
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true }
});

import { FavouriteStopModel } from './FavouriteStop/model';
import { UserModel } from './User/model';
import { StopModel } from './Stop/model';
import { StopRouteModel } from './StopRoute/model';
import { RouteModel } from './Route/model';
import { StopTimeModel } from './StopTime/model';
import { TripModel } from './Trip/model';
import { ServiceModel } from './Service/model';
import { ServiceExceptionModel } from './ServiceException/model';

export {
    Date, UserModel, FavouriteStopModel, StopModel, StopRouteModel,
    RouteModel, StopTimeModel, TripModel, ServiceModel, ServiceExceptionModel
};