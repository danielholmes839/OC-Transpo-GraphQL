const schema = `
    interface Node {
        id: ID!
    }

    type Date {
        year: Int!
        month: Int!
        day: Int!
    }

    type Time {
        hour: Int!
        minute: Int!
        string: String!
        int: Int!
    }

    type User implements Node {
        id: ID!
        email: String!
        password: String
        favouriteStops: [FavouriteStop!]!
    }

    type LoginData {
        user: User!
        token: String!
        expiration: Int!
    }

    type FavouriteStop implements Node {
        id: ID!
        user: User!
        stop: Stop!
        stopRoutes: [StopRoute!]!
    }
    
    input FavouriteStopInput {
        stop: ID!
        stopRoutes: [ID!]
    }

    type Stop implements Node {
        id: ID!
        name: String!
        code: String!
        lat: Float!
        lon: Float!
        routes: [Route!]!
        stopRoutes: [StopRoute!]!
    }

    scalar Map

    type StopRoute implements Node {
        id: ID!
        headsign: String!           # route headsign
        number: String!             # route number
        stop: Stop!
        route: Route!
        stopTimes: [StopTime!]!
        nextStopTimes(limit: Int): [StopTime!]!
        map: Map
        gps: RouteGPS!
    }

    type RouteGPS {
        busCount: Int!
        buses: [BusGPS!]!
    }

    type BusGPS {
        headsign: String!
        direction: Int!
        lat: Float!
        lon: Float!
        speed: Float!
    }

    type Route implements Node {
        id: ID!
        number: String!
        routeType: Int!
        colour: String!
        textColour: String!
        trips: [Trip!]!
        stops: [Stop!]!
    }

    type Trip implements Node {
        id: ID!
        headsign: String!
        direction: Int!
        route: Route!
        service: Service!
        stopTimes: [StopTime!]!
    }

    type StopTime implements Node {
        id: ID!
        sequence: Int!
        time: Time!
        trip: Trip!
        stop: Stop!     
        route: Route!
    }

    type Service implements Node {
        id: ID!
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

    type ServiceException implements Node {
        id: ID!
        date: Date!
        removed: Boolean!
    }

    type Query {
        tripGet(trip: ID!): Trip
        routeGet(route: ID!): Route

        # Stop Query
        stopGet(stop: ID!): Stop
        stopSearch(name: String!, limit: Int!): [Stop!]!
        
        # User Query
        userGet: User
        userLogin(email: String!, password: String!): LoginData
    }

    type Mutation {
        userCreate(email: String!, password: String!): User
        userFavouriteStopAdd(favouriteStop: FavouriteStopInput): FavouriteStop
    }
`;

module.exports = schema;