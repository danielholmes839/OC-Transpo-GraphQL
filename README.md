# GraphQL API for GTFS data

GraphQL API for GTFS (General Transit Feed Specification) data created using Apollo-Express-Server.

## Schema

The full schema can be found [here](../api/graphql/schema/index.js). The graph below shows the relationship between types:

![schema diagram](api/graphql/schema/diagram.png)

## Example Queries

Getting stop data

![get stop](./examples/get_stop.PNG)

Creating a user:

![create user](./examples/create_user.PNG)

Logging in:

![logging in](./examples/login.PNG)

Add a favourite stop:

![add favourite stop](./examples/add_favourite_stop.PNG)

Get favourite stops:

![get favourite stops](./examples/favourite_stops.PNG)

## Prototype

Example of a UI where all data can be obtained from one GraphQL query:
![example](prototype/app_prototype/example.PNG)
