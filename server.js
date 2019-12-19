const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const { STOPS, STOP_TIMES, TRIPS } = require('./data');
const { Stop, StopTime, Trip, Route } = require('./types/package');

/* GraphQL Schema */
var schema = buildSchema(`
    type Trip {
        id: String!
        route_id: String!
        service_id: String!
        trip_headsign: String!
    }

    type StopTime {
        id: String!
        trip_id: String!
        stop_id: String!
        time: String!
    }

    type Route {
        id: String!
        number: Int!
        name: String!
        type: String!
        type_number: Int!
        colour: String!
        trips: [String!]!
        getTrips: [Trip]!
        getNextStopTime: StopTime!
        getStopTimes: [StopTime]!
    }

    type Stop {
        id: String!
        code: String!
        name: String!
        lat: Float!
        lon: Float!
        routes: [String]!
        getRoute(route_id: String!): Route!
        getRoutes: [Route]!
        getNextStopTime(route_id: String!): StopTime!
    }
  
    type Query {
        getStop(stop_id: String!): Stop!
        getStops(stop_ids: [String!]!): [Stop]!
    }
`);

var root = {
    // Resolvers 
    getStop: ({ stop_id }) => {
        // Get Stop by ID
        return new Stop(STOPS[stop_id]);
    },

    getStops: ({ stop_ids }) => {
        // Get Stops by IDs
        var stops = [];
        for (var stop_id of stop_ids) {
            stops.push(new Stop(STOPS[stop_id]));
        };
        return stops;
    }
};

var app = express();

app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(3000);
console.log('Beep Boop Listening on: http://localhost:3000/graphql');
