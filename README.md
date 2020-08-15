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

3. OC Transpo could also do a better job when it comes to returning useful fields. For example, when OC Transpo gives you live bus data it doesn't actually have a field for the bus' arrival time. Instead, it has a "TripStartTime" field, representing a time as a string formatted "hh:mm" of when the bus started it's trip, and an "AdjustedScheduleTime" field, representing how many minutes after the "TripStartTime" the bus will arrive. So, to get the arrival time you need to parse the "TripStartTime" field and add the "AdjustedScheduleTime". Aside from the extra parsing, this doesn't seem like a big deal, EXCEPT! you're left with no way to determine the originally scheduled arrival time or if the bus is late or early! There's also a field called "AdjustmentAge", representing the number of minutes it's been since the live bus data was updated. When "AdjustmentAge" is -1 that means it hasn't been updated and the bus is on schedule. When it is adjusted, you're still unable to tell if the bus is late or early. It would also be extremely useful to be able to link a bus to the OC Transpo GTFS dataset, either by the [trip id](https://developers.google.com/transit/gtfs/reference#tripstxt) or by [stop times](https://developers.google.com/transit/gtfs/reference#stop_timestxt).

## Travel Planner

I'm currently designing a travel planner using A* search. More details will be added when it's complete.
The graph data representing the entire transit system can be found [here](./src/astar/GRAPH.json). This is a visualization of the graph:

![graph](content/graph.png)
