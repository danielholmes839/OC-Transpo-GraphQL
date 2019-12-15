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
        getTrips: [Trip]!
    }

    type Stop {
        id: String!
        code: String!
        name: String!
        lat: Float!
        lon: Float!
        routes: [Route]!
        getRoute(route_id: String!): Route!
        getNextStopTime(route_id: String!): StopTime!
    }
  
    type Query {
        getStop(stop_id: String!): Stop!
        getStops(stop_ids: [String!]!): [Stop]!
        getStopTime(stop_id: String, trip_id: String): StopTime
    }
`);

// The root provides a resolver function for each API endpoint
var root = {

    getStop: ({ stop_id }) => {
        var { id, code, name, lat, lon, routes } = STOPS[stop_id];
        return new Stop(id, code, name, lat, lon, routes);
    },

    getStops: ({ stop_ids }) => {
        var stops = [];
        for (var stop_id of stop_ids) {
            var { id, code, name, lat, lon, routes } = STOPS[stop_id];
            stops.push(new Stop(id, code, name, lat, lon, routes));
        }
        return stops;
    },

    getStopTime: ({ stop_id, trip_id }) => {
        //console.log(STOP_TIMES);
        var stop_time = STOP_TIMES[`${trip_id}-${stop_id}`];
        var { id, trip_id, stop_id, time } = stop_time;
        return new StopTime(id, trip_id, stop_id, time);
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

