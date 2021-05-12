# OC Transpo GraphQL API

This is a [GraphQL API](https://graphql.org/) for Ottawa's public transit system OC Transpo. It includes access to [GTFS data](https://developers.google.com/transit/gtfs) (general transit feed specification), live bus data, by wrapping [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc), and maps for live buses using google maps API.

Built with:
[TypeScript](https://www.typescriptlang.org/),
[Apollo-Server](https://www.apollographql.com/docs/apollo-server/),
[MongoDB](https://www.mongodb.com/) and
[Google Maps](https://cloud.google.com/maps-platform/maps)

## Website / Client

I built [stop-checker.com](https://www.stop-checker.com/) using this API!

## GraphQL Endpoint / Deployment

The GraphQL enpoint can be found [here](https://octranspo-graphql.herokuapp.com/graphql). The API is currently deployed to Heroku.  The React client is deployed using Netlify entirely separate from the API.

## Schema

The full schema can be found [here](./src/resolvers/index.ts).
I highly recommend taking at look at the schema using [GraphQL Voyager](https://apis.guru/graphql-voyager/) (to use it you need to copy and paste in the schema). Most types will match up with tables in GTFS: Stop, Route, StopTime, Trip, Service, Service Exception. The most important type that was added is "StopRoute". StopRoutes are able to reference data for a route at a given stop including: live bus data, live maps, stop times / schedules, and the direction of the route at that stop.

There is also a user system. This allows users to add / remove favourite stops, and routes within those stops. The authentication is done using JWT. However, this currently not a part of the functionality of the website.

## OC Transpo's REST API

I used [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc) to generate maps of buses in real time, and see updated arrival times.


## Next Steps

- I would like to add email verification and password resets. I currently have email and password login which returns a JWT to authenticate future requests
- Providing a travel planner. I implemented A* search but it didn't get great results. I would probably use [OpenTripPlanner](https://github.com/opentripplanner) which provides a travel planner for GTFS datasets.
- Better error messages for mutations, and queries... I'm currently just throwing errors in my code which isn't ideal
- Adding better pagination might be a good idea
