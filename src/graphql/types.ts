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

interface Bus {
    headsign: string;
    routeNumber: string;
    direction: number;
    lat: number;
    lon: number;
    speed: number;
}

interface Context {
    user: string;
    email: string;
    authenticated: boolean;
}

interface Login {
	email: string;
	password: string;
}

interface LoginPayload {
	user: User;
	token: string;
	expiration: number;
}


export { Date, Time, Bus, Context, FavouriteStop, User, Stop, StopRoute, Route, StopTime, Trip, Service, ServiceException, Login, LoginPayload }