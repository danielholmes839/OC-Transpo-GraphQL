const { buildSchema } = require('graphql');

var schema = buildSchema(`
    input UserInput {
        email: String!
        password: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        favouriteStops: [FavouriteStop!]!
    }

    type AuthData {
        userId: ID!
        token: String!
        expiration: Int!
    }

    type FavouriteStop {
        user: User!
        stop: Stop!
        stopRoutes: [StopRoute!]! # Routes user cares about
    }

    input StopInput {
        _id: String!
        code: String!
        name: String!
        lat: Float!
        lon: Float!
    }

    type Stop {
        _id: ID!
        name: String!
        code: String!
        lat: Float!
        lon: Float!
        routes: [Route!]!
        stopRoutes: [StopRoute!]!
    }

    type StopRoute {
        _id: ID!
        stop: Stop!
        route: Route!
        stopTimes: [StopTime!]!
    }

    input RouteInput {
        _id: ID!
        name: String!
        routType: Int!
        colour: String!
        textColour: String!
    }

    type Route {
        _id: ID
        name: String!
        routeType: Int!
        colour: String!
        textColour: String!
        trips: [Trip!]!
        stops: [Stop!]!
    }

    type Trip {
        _id: ID!
        headsign: String!
        direction: Int!
        route: Route!
        service: Service!
        stopTimes: [StopTime!]!
    }

    type StopTime {
        _id: ID!
        time: String!
        sequence: Int!
        trip: Trip!
        stop: Stop!
        route: Route!
    }

    type Service {
        _id: ID!
        startDate: String!
        endDate: String!
        monday: Boolean!
        tuesday: Boolean!
        wednesday: Boolean!
        thursday: Boolean!
        friday: Boolean!
        saturday: Boolean!
        sunday: Boolean!
        trips: [Trip!]!
    }

    type Query {
        getStops: [Stop!]!
        getUsers: [User!]!
        getRoutes: [Route!]!
        getTrips: [Trip!]!
        getTrip(_id: String): Trip!
        getRoute(_id: String): Route!
        getStop(_id: String): Route!
        login(email: String!, password: String!): AuthData!
    }

    type Mutation {
        addFavouriteStop(stopId: String): Stop
        createStop(stopInput: StopInput): Stop
        createUser(userInput: UserInput): User
    }
`);

module.exports = schema;