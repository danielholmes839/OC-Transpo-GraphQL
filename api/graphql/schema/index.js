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
        _id: ID!
        user: User!
        stop: Stop!
        stopRoutes: [StopRoute!]!
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
        headsign: String!           # route headsign
        number: String!             # route number
        stop: Stop!
        route: Route!
        stopTimes: [StopTime!]!
        nextStopTime: StopTime!
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

    type Date {
        year: Int!
        month: Int!
        day: Int!
        yyyymmdd: String!                   # Maybe temporary
        format(format: String!): String!
    }

    type Service {
        _id: ID!
        start: Date!
        end: Date!                         
        exceptions: [ServiceException!]!

        monday: Boolean!
        tuesday: Boolean!
        wednesday: Boolean!
        thursday: Boolean!
        friday: Boolean!
        saturday: Boolean!
        sunday: Boolean!
    }

    type ServiceException {
        date: Date!
        removed: Boolean!                   # True if service was removed False if service was added
    }

    type Query {
        getUser: User
        getTrip(trip: String!): Trip
        getRoute(route: String!): Route
        getStop(stop: String!): Stop
        searchStops(name: String!, limit: Int!): [Stop!]!
        login(email: String!, password: String!): AuthData
    }

    type Mutation {
        createUser(email: String!, password: String!): User
        addFavouriteStop(favouriteStop: FavouriteStopInput): FavouriteStop
    }
`;

module.exports = schema;