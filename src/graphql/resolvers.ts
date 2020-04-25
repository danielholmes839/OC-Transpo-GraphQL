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
import Service from './Service/resolvers';
import ServiceException from './ServiceException/resolvers';
import LiveBusData from './LiveBusData/resolvers';
import StaticStopRouteMap from './StaticStopRouteMap/resolvers';
import Distance from './Distance/resolvers';
import Schedule from './Schedule/resolvers';

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
    Service,
    ServiceException,
    LiveBusData,
    StaticStopRouteMap,
    Distance,
    Schedule
}

export default resolvers;