import { IResolvers } from 'graphql-tools';
import Query from './Query';
import Mutation from './Mutation';
import User from './User';
import FavouriteStop from './FavouriteStop';
import Route from './Route';
import Stop from './Stop';
import StopRoute from './StopRoute';
import StopTime from './StopTime';
import Trip from './Trip';
import StopTimeService from './StopTimeService';
import Service from './Service';
import ServiceException from './ServiceException';
import LiveBusData from './LiveBusData';
import StaticStopRouteMap from './StaticStopRouteMap';
import Distance from './Distance';
import Schedule from './Schedule';
import Time from './Time';
import Date from './Date';
import Day from './Day';
import gql from 'graphql-tag';

const resolvers: IResolvers = { 
    Query, Mutation, User, FavouriteStop, Route, Stop, 
    StopRoute, StopTime, Trip, StopTimeService, Service, ServiceException, 
    LiveBusData, StaticStopRouteMap, Distance, Schedule, Time, Date, Day
}

const schema = gql`
    type Query {
        # Stop Queries
        Stop_get(id: ID!): Stop
        Stop_getMany(ids: [ID!]!): [Stop]!
        Stop_search(name: String!, skip: Int, limit: Int): [Stop!]!
        
        # Route Queries
        Route_get(id: ID!): Route
        Route_getMany(ids: [ID!]!): [Route]!
        
        # StopRoute Queries
        StopRoute_get(id: ID!): StopRoute
        StopRoute_getMany(ids: [ID!]!): [StopRoute]!
        
        # Trip Queries
        Trip_get(id: ID!): Trip
        Trip_getMany(ids: [ID!]!): [Trip]!

        # StopTime Queries
        StopTime_get(id: ID!): StopTime
        StopTime_getMany(ids: [ID!]!): [StopTime]!

        # Service Queries
        Service_get(id: ID!): Service
        Service_getMany(ids: ID!): [Service]!

        # User Queries
        User_get: User
        User_login(email: String!, password: String!): String
    }

    type Mutation {
        User_create(email: String!, password: String!): User
        User_FavouriteStop_add(stop: ID!): FavouriteStop
        User_FavouriteStop_remove(favouriteStop: ID!): FavouriteStop
        User_FavouriteStop_StopRoutes_add(favouriteStop: ID!, stopRoutes: [ID!]!): FavouriteStop
        User_FavouriteStop_StopRoutes_remove(favouriteStop: ID!, stopRoutes: [ID!]!): FavouriteStop
    }

    type User {
        id: ID!
        email: String!
        favouriteStops: [FavouriteStop]!
    }

    type FavouriteStop {
        id: ID!
        user: User!
        stop: Stop!
        stopRoutes: [StopRoute!]!
    }

    type Stop {
        id: ID!
        name: String!
        code: String!
        lat: Float!
        lon: Float!
        routes: [Route!]!
        stopRoutes: [StopRoute!]!
    }

    type StopRoute {
        id: ID!
        headsign: String!
        direction: Int!
        number: String!
        stop: Stop!						
        route: Route!
        schedule: Schedule!
        liveBusData: LiveBusData!
        map(width: Int, height: Int): StaticStopRouteMap
    }

    type Schedule {
        next(limit: Int): [StopTime!]!  # Contains stop times today, then tomorrow when necessary
        all: [StopTime!]!				# All stop times
        allToday: [StopTime!]!			# All stop times today
        allTomorrow: [StopTime!]!		# All stop times tommorow
    }

    type Route {
        id: ID!
        number: String!
        type: String!
        backgroundColour: String!
        textColour: String!
        trips: [Trip!]!
        stops: [Stop!]!
    }

    type Trip {
        id: ID!
        headsign: String!
        direction: Int!
        route: Route!
        service: Service!
        stopTimes: [StopTime!]!
    }

    type StopTime {
        id: ID!
        sequence: Int!
        time: Time!
        trip: Trip!
        service: StopTimeService!
        stop: Stop!   
        route: Route!
        stopRoute: StopRoute!  
    }

    type StopTimeService {
        service: Service!
        # More accurate days compared to Service type
        runningToday: Boolean!
        runningTomorrow: Boolean!
        runningOn(day: Day!): Boolean!
        runningOnMany(days: [Day!]!): [Boolean!]!
    }

    type Service {
        id: ID!
        start: Date!
        end: Date!
        active: Boolean!                        
        exceptions: [ServiceException!]!
        exceptionCount: Int!
        runningToday: Boolean!
        runningTomorrow: Boolean!
        runningOn(day: Day!): Boolean!
        runningOnMany(days: [Day!]!): [Boolean!]!
    }

    type ServiceException {
        id: ID!
        date: Date!
        removed: Boolean!
    }

    type LiveBusData {
        nextBus: Bus
        buses: [Bus!]!
        busCount: Int!
        busCountGPS: Int!
    }

    type Bus {
        number: String!
        headsign: String!
        direction: Int!
        gps: BusPosition
        age: Int! 				# Time since lat updated in minutes
        arrival: Time!			# When the bus will arrive
        onTime: Boolean!		# Whether or not the arrival time has been adjusted
    }

    type BusPosition {
        lat: Float!
        lon: Float!
        distance: Distance!
    }

    # Scalars
    scalar Distance							# Distance string "5km", "3.1km", "800m"
    scalar StaticStopRouteMap				# static google maps URL for a StopRoute

    # Enums
    enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

    # Date and Time
    type Time {
        int: Int!							# Minutes into the day
        intRemaining: Int!					# Minutes until this time
        string: String!						# Time as a string - could add more formatting options later...
        stringRemaining: String!			# Minutes until this time
        passed: Boolean!					# Currently past this time in the day
    }

    type Date {
        unix: Float!						# Unix time milliseconds
        string: String!			
    }
`
export { resolvers, schema };