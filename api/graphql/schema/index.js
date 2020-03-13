const schema = `
    type User {
        _id: ID!
        email: String!
        password: String
        favouriteStops: [FavouriteStop!]!
    }

    type AuthData {
        user: User!
        token: String!
        expiration: Int!
    }

    input FavouriteStopInput {
        stop: String!
        stopRoutes: [String!]!
    }

    type FavouriteStop {
        _id: String!
        user: User!
        stop: Stop!
        stopRoutes: [StopRoute!]! # Routes user cares about
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

    type Route {
        _id: ID!
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
        getUser: User
        getTrip(trip: String!): Trip
        getRoute(route: String!): Route
        getStop(stop: String!): Stop
        login(email: String!, password: String!): AuthData
    }

    type Mutation {
        createUser(email: String!, password: String!): User
        addFavouriteStop(favouriteStop: FavouriteStopInput): FavouriteStop
    }
`;

module.exports = schema;