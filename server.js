const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const { STOPS, STOP_TIMES, TRIPS } = require('./data');
const { Stop, StopTime, Trip, Route } = require('./types/package');

var schema = buildSchema(`
    type Trip {
        id: String
        route_id: String
        service_id: String
        trip_headsign: String
    }

    type StopTime {
        id: String
        trip_id: String
        stop_id: String
        time: String
    }

    type Route {
        id: String!
        number: Int!
        name: String!
        trips: [String!]!
    }

    type Stop {
        id: String!
        code: String!
        name: String!
        lat: Float!
        lon: Float!
        routes: [Route]!
        getRoute(route_id: String!): Route!
    }
  
    type Query {
        getStop(stop_id: String!): Stop!
        getStops(stop_ids: [String!]!): [Stop]!
    }
`);

// The root provides a resolver function for each API endpoint
var root = {

    getStop: ({ stop_id }) => {
        return STOPS[stop_id];
    },

    getStops: ({ stop_ids }) => {
        var stops = [];
        for (var stop_id of stop_ids) {
            stops.push(STOPS[stop_id]);
        }
        return stops;
    }
};

var app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(3000);
console.log('Beep Boop Listening on: http://localhost:3000/graphql');

