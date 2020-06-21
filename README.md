# OC Transpo GraphQL API

This is a [GraphQL API](https://graphql.org/) for OC Transpo data. It includes access to [GTFS data](https://developers.google.com/transit/gtfs) (general transit feed specification), live bus data, by wrapping [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc), travel plans using A* search, and maps for live buses using google maps API. I am currently building a web application using this API for anyone to use very soon!

Built using
[TypeScript](https://www.typescriptlang.org/),
[Apollo-Server](https://www.apollographql.com/docs/apollo-server/),
[MongoDB](https://www.mongodb.com/) and
[Google Maps](https://cloud.google.com/maps-platform/maps)

## Examples

The API is currently deployed to Heroku: [https://octranspo-graphql.herokuapp.com/graphql](https://octranspo-graphql.herokuapp.com/graphql). I wrote some example queries to try [here](./content/examples)!

## OC Transpo's REST API

[OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc) could be greatly improved. I wrapped it with GraphQL to fix a lot of its issues. 

1. The biggest problem with OC Transpo's API is that the structure of the data it returns is inconsistent. I think OC Transpo has this issue because their API returns XML by default and is converting it to JSON. Certain fields in the response can be an object, a list of objects, or missing/null. There are also some fields which contain an object with one subfield, which is unusual. I broke down the response I was getting from their API into Typescript types, which highlight these issues. You can find them [here](./src/graphql/LiveBusData/types.ts). This issue does not come from REST, but GraphQL forces you to follow a schema so you can't return data with an inconsistent structure.

2. Documentation for OC Transpo's API could be greatly improved, especially for documenting nullable fields. It returns latitude and longitude of buses as strings, and when they have no data it returns an empty string. I changed latitude and longitude to be floats, which makes more sense, and when no data is availabe they are null. With GraphQL, even without added documentation, the schema is extremely descriptive.

3. OC Transpo could also do a better job when it comes to returning useful fields. For example, when OC Transpo gives you live bus data it doesn't actually have a field for the bus' arrival time. Instead, it has a "TripStartTime" field, representing a time as a string formatted "hh:mm" of when the bus started it's trip, and an "AdjustedScheduleTime" field, representing how many minutes after the "TripStartTime" the bus will arrive. So, to get the arrival time you need to parse the "TripStartTime" field and add the "AdjustedScheduleTime". Aside from the extra parsing, this doesn't seem like a big deal, EXCEPT! you're left with no way to determine the originally scheduled arrival time or if the bus is late or early! There's also a field called "AdjustmentAge", representing the number of minutes it's been since the live bus data was updated. When "AdjustmentAge" is -1 that means it hasn't been updated and the bus is on schedule. When it is adjusted, you're still unable to tell if the bus is late or early. It would also be extremely useful to be able to link a bus to the OC Transpo GTFS dataset, either by the [trip id](https://developers.google.com/transit/gtfs/reference#tripstxt) or by [stop times](https://developers.google.com/transit/gtfs/reference#stop_timestxt).

## Travel Planner

I'm currently designing a travel planner using A* search. More details will be added when it's complete.
The graph data representing the entire transit system can be found [here](./src/astar/GRAPH.json). This is a visualization of the graph:

![graph](content/graph.png)

## Schema

The full schema can be found [here](./src/graphql/schema.ts).
I highly recommend taking at look at the schema using [GraphQL Voyager](https://apis.guru/graphql-voyager/) (to use it you need to copy and paste in the schema).
This is a simplified diagram of the most important types:

![schema diagram](content/diagram.png)

## Prototype Dashboard

![example](content/ui.png)
