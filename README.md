# OC Transpo GraphQL API

This is a [GraphQL API](https://graphql.org/) for OC Transpo data. It includes access to [GTFS data](https://developers.google.com/transit/gtfs) (general transit feed specification), live bus data, by wrapping [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc), travel plans using A* search, and maps for live buses using google maps API.

Built with: 
[TypeScript](https://www.typescriptlang.org/),
[Apollo-Server](https://www.apollographql.com/docs/apollo-server/),
[MongoDB](https://www.mongodb.com/) and
[Google Maps](https://cloud.google.com/maps-platform/maps)

## Web Application

[stop-checker.com](https://www.stop-checker.com/) is the front-end client / website I created using this API. It's really cool!

## GraphQL Endpoint / Deployment

The GraphQL enpoint can be found [here](https://octranspo-graphql.herokuapp.com/graphql). The API is currently deployed to Heroku. I had originally deployed the API on AWS Elastic Beanstalk but due to the cost of AWS (and pain of setting up HTTPS) I'll keep using Heroku. The client is deployed using netlify entirely separate from the API.

If I need to scale this API further I will need to:

- Remove in-memory caching of live bus data
- Upgrade MongoDB Atlas free tier and probably switch to AWS, or Azure
- Use a load balancing solution such as AWS Elastic Beanstalk

## Schema

The full schema can be found [here](./src/api/schema.ts).
I highly recommend taking at look at the schema using [GraphQL Voyager](https://apis.guru/graphql-voyager/) (to use it you need to copy and paste in the schema). Most types will match up with tables in GTFS: Stop, Route, StopTime, Trip, Service, Service Exception. The most important type that was added is "StopRoute". StopRoutes are able to reference data for a route at a given stop including: live bus data, live maps, stop times / schedules, and the direction of the route at that stop.

There is also a user system. This allows users to add / remove favourite stops, and routes within those stops. The authentication is done using JWT. However, this currently not a part of the functionality of the website.

## OC Transpo's REST API

[OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc) could be greatly improved. I wrapped it with GraphQL to fix a lot of its issues.

1. The biggest problem with OC Transpo's API is that the structure of the data it returns is inconsistent. I think OC Transpo has this issue because their API returns XML by default and is converting it to JSON. Certain fields in the response can be an object, a list of objects, or missing/null. There are also some fields which contain an object with one subfield, which is unusual. I broke down the response I was getting from their API into Typescript types, which highlight these issues. You can find them [here](./src/api/LiveBusData/types.ts). This issue does not come from REST, but GraphQL forces you to follow a schema so you can't return data with an inconsistent structure.

2. Documentation for OC Transpo's API could be greatly improved, especially for documenting nullable fields. It returns latitude and longitude of buses as strings, and when they have no data it returns an empty string. I changed latitude and longitude to be floats, which makes more sense, and when no data is availabe they are null. With GraphQL, even without added documentation, the schema is extremely descriptive.

3. OC Transpo could also do a better job when it comes to returning useful fields. For example, when OC Transpo gives you live bus data it doesn't actually have a field for the bus' arrival time. Instead, it has a "TripStartTime" field, representing a time as a string formatted "hh:mm" of when the bus started it's trip, and an "AdjustedScheduleTime" field, representing how many minutes after the "TripStartTime" the bus will arrive. So, to get the arrival time you need to parse the "TripStartTime" field and add the "AdjustedScheduleTime". Aside from the extra parsing, this doesn't seem like a big deal, EXCEPT! you're left with no way to determine the originally scheduled arrival time or if the bus is late or early! There's also a field called "AdjustmentAge", representing the number of minutes it's been since the live bus data was updated. When "AdjustmentAge" is -1 that means it hasn't been updated and the bus is on schedule. It would also be extremely useful to be able to link a bus to the OC Transpo GTFS dataset, either by the [trip id](https://developers.google.com/transit/gtfs/reference#tripstxt) or by [stop time](https://developers.google.com/transit/gtfs/reference#stop_timestxt) ids.

## Next Steps

- I would like to add authentication using Firebase. I already have my own JWT setup. But doing email verification and password resets are still not implemented. I would need to do this before adding user functionality to the website

- Travel planner. I worked on this for a while and got decent results with Astar search but it could be improved.

- Better error messages for mutations, and queries... I'm currently just throwing errors in my code which isn't ideal.

## Full Schema
2020/09/20

```graphql
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
    serviceToday: Boolean!
    serviceTomorrow: Boolean!
    serviceIsNextDay: Boolean!  # The time of the stop time was originally past 24 hours
    monday: Boolean!
    tuesday: Boolean!
    wednesday: Boolean!
    thursday: Boolean!
    friday: Boolean!
    saturday: Boolean!
    sunday: Boolean!
}

type Service {
    id: ID!
    start: Date!
    end: Date!                         
    exceptions: [ServiceException!]!
    serviceToday: Boolean!
    serviceTomorrow: Boolean!	
    monday: Boolean!
    tuesday: Boolean!
    wednesday: Boolean!
    thursday: Boolean!
    friday: Boolean!
    saturday: Boolean!
    sunday: Boolean!
}

type ServiceException {
    id: ID!
    date: Date!
    removed: Boolean!
}

type GPS {
    lat: Float
    lon: Float
    speed: Float
    distance: Distance
}

type Bus {
    headsign: String!
    number: String!
    gps: GPS
    age: Int! 				# Time since lat updated in minutes
    arrival: Time!			# When the bus will arrive
    onTime: Boolean!		# Whether or not the arrival time has been adjusted
}

type LiveBusData {
    nextBus: Bus
    buses: [Bus!]!
    busCount: Int!
    busCountGPS: Int!
}

type Query {
    # Stop Queries
    Stop_get(id: ID!): Stop
    Stop_getMany(ids: [ID!]!): [Stop]!
    Stop_search(name: String!, limit: Int): [Stop!]!
    
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

# Scalar Types
scalar Distance							# Distance string "5km", "3.1km", "800m"
scalar StaticStopRouteMap				# static google maps URL for a StopRoute

# Date and Time
type Time {
    int: Int!							# Minutes into the day
    intRemaining: Int!					# Minutes until this time
    string: String!						# Time as a string - could add more formatting options later...
    stringRemaining: String!			# Minutes until this time
    passed: Boolean!					# Currently past this time
}

type Date {
    year: Int!					
    month: Int!
    day: Int!
    string: String!			
}
```
