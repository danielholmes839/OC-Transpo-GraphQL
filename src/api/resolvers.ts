import { IResolvers } from 'graphql-tools';
import Query from './Query/resolvers';
import Mutation from './Mutation/resolvers';
import User from './User/resolvers';
import FavouriteStop from './FavouriteStop/resolvers';
import Route from './Route/resolvers';
import Stop from './Stop/resolvers';
import StopRoute from './StopRoute/resolvers';
import StopTime from './StopTime/resolvers';
import Trip from './Trip/resolvers';
import StopTimeService from './StopTimeService/resolvers';
import Service from './Service/resolvers';
import ServiceException from './ServiceException/resolvers';
import LiveBusData from './LiveBusData/resolvers';
import { StaticStopRouteMap } from './Maps/resolvers';
import Distance from './Distance/resolvers';
import Schedule from './Schedule/resolvers';
import Time from './Time/resolvers';
import Date from './Date/resolvers';
import Day from './Day';

const resolvers: IResolvers = {
    Query,
    Mutation,
    User,
    FavouriteStop,
    Route,
    Stop,
    StopRoute,
    StopTime,
    Trip,
    StopTimeService,
    Service,
    ServiceException,
    LiveBusData,
    StaticStopRouteMap,
    Distance,
    Schedule,
    Time,
    Date,
    Day
}

export default resolvers;