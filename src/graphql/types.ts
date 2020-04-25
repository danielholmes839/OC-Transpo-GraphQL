import { FavouriteStop } from './FavouriteStop/types';
import { User } from './User/types';
import { Stop } from './Stop/types';
import { StopRoute } from './StopRoute/types';
import { Route } from './Route/types';
import { StopTime } from './StopTime/types';
import { Trip } from './Trip/types';
import { Service } from './Service/types';
import { ServiceException } from './ServiceException/types';


interface Date {
    year: number;
    month: number;
    day: number;
}

interface Time {
    hour: number;
    minute: number;
    int: number;
}

interface Context {
    user: string;
    email: string;
    authenticated: boolean;
}

export { Date, Time, Context, FavouriteStop, User, Stop, StopRoute, Route, StopTime, Trip, Service, ServiceException }