# OC Transpo GraphQL API

This is a [GraphQL API](https://graphql.org/) for OC Transpo data. It includes access to [GTFS data](https://developers.google.com/transit/gtfs) (general transit feed specification), live bus data, by wrapping [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc), and maps for live buses using google maps API.

Built with: 
[TypeScript](https://www.typescriptlang.org/),
[Apollo-Server](https://www.apollographql.com/docs/apollo-server/),
[MongoDB](https://www.mongodb.com/) and
[Google Maps](https://cloud.google.com/maps-platform/maps)

## Website

[stop-checker.com](https://www.stop-checker.com/) is a website I created using this API

## GraphQL Endpoint / Deployment

The GraphQL enpoint can be found [here](https://octranspo-graphql.herokuapp.com/graphql). The API is currently deployed to Heroku. I had originally deployed the API on AWS Elastic Beanstalk but due to the cost of AWS (and pain of setting up HTTPS) I'll keep using Heroku. The client is deployed using netlify entirely separate from the API.

If I need to scale this API further I will need to:

- Remove in-memory caching of live bus data
- Upgrade from MongoDB Atlas free tier and probably switch to AWS, or Azure
- Use a load balancing solution such as AWS Elastic Beanstalk

## Schema

The full schema can be found [here](./src/resolvers/schema.ts).
I highly recommend taking at look at the schema using [GraphQL Voyager](https://apis.guru/graphql-voyager/) (to use it you need to copy and paste in the schema). Most types will match up with tables in GTFS: Stop, Route, StopTime, Trip, Service, Service Exception. The most important type that was added is "StopRoute". StopRoutes are able to reference data for a route at a given stop including: live bus data, live maps, stop times / schedules, and the direction of the route at that stop.

There is also a user system. This allows users to add / remove favourite stops, and routes within those stops. The authentication is done using JWT. However, this currently not a part of the functionality of the website.

## OC Transpo's REST API

[OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc) could be greatly improved. I wrapped it with GraphQL which fixed a lot it's issue.

1. The biggest problem with OC Transpo's API is that the structure of the data it returns is inconsistent. I think OC Transpo has this issue because their API returns XML by default and is converting it to JSON. Certain fields in the response can be an object, a list of objects, or missing/null. There are also some fields which contain an object with one subfield, which is unusual. I broke down the responses I was getting from their API into Typescript types, which highlight these issues. These types are defined [here](./src/octranspo/types.ts). It caused me a lot of headache trying to figure out and their documentation only gave one sample response in XML. I was eventually able to parse the responses correctly and incorporate the data into my GraphQL API.

2. OC Transpo's API could be greatly improved especially for documenting the type of their fields and if they are nullable. It returns latitude and longitude of buses as strings instead of as numbers and when there is no data for these field they are returned as empty strings. I changed latitude and longitude to be floats, which makes more sense in my opinion, and when no data is availabe they are null. GraphQL is really great because even without added documentation, the schema will accurately describe the type and nullability of fields.

3. OC Transpo could also do a better job when it comes to providing useful fields. For example, when OC Transpo gives you live bus data it doesn't actually have a field for the bus' arrival time. Instead, it has a "TripStartTime" field, representing a time as a string formatted "hh:mm" of when the bus started it's trip, and an "AdjustedScheduleTime" field, representing how many minutes after the "TripStartTime" the bus will arrive. So, to get the arrival time you need to parse the "TripStartTime" field and add the "AdjustedScheduleTime". Aside from the extra parsing, this doesn't seem like a big deal, except you're left with no way to determine the originally scheduled arrival time. The "TripStartTime" is a nice field however, it would be even more useful if the [trip id](https://developers.google.com/transit/gtfs/reference#tripstxt) was given. This would allow the live bus to be linked to the OC Transpo GTFS dataset.

## Next Steps

- I would like to add email verification and password resets. I currently have email and password login which returns a JWT to authenticate future requests
- Providing a travel planner. I implemented A* search but it didn't get great results. I would probably use [OpenTripPlanner](https://github.com/opentripplanner) which provides a travel planner for GTFS datasets.
- Better error messages for mutations, and queries... I'm currently just throwing errors in my code which isn't ideal
- Adding better pagination might be a good idea
