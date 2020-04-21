# General Transit Feed Specification GraphQL API

This is a [GraphQL API](https://graphql.org/) designed for [General Transit Feed Specification](https://developers.google.com/transit/gtfs)
(GTFS) data from OC Transpo which is Ottawa's public transit system.
In addition to being able to query GTFS data this API wraps [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc)
for live buses which includes updated arrival times and GPS data. The GraphQL API can also generate static maps using Google Maps.

Built using
[TypeScript](https://www.typescriptlang.org/),
[Apollo-Server](https://www.apollographql.com/docs/apollo-server/),
[MongoDB](https://www.mongodb.com/) and
[Google Maps](https://cloud.google.com/maps-platform/maps)

## OC Transpo's REST API

Wrapping [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc) with GraphQL provides many benefits:

- Documenting nullable fields. OC Transpo's documentation does not say if a field is nullable. For example bus GPS data (latitude, longitude and speed)
from OC Transpo API is returned as strings which are often empty.
In the GraphQL API I changed GPS data to returned as floats and be nullable and reflected in the schema.
To make it even easier for users I added another field "hasGPS" which returns a boolean value if that bus has GPS data.

- The response structure is much easier to understand. While using OC Transpo's API I noticed certain fields could be a list of Objects or a single Object.
I think this is some sort of issue with their API being default XML and being converted to JSON before being sent but I'm not sure.
Another thing that I noticed was a field that only had one nested subfield which was very redundant.
I broke the response I was getting from their API down into TypeScript types which highlight these issues you can find them [here](./src/graphql/LiveBusData/types.ts).
GraphQL ensures the response structure is always consistent.

- Added features to put bus data into google maps and calculate distance from their destination

- Fields were renamed to be more accurate and to match what was being used in the rest of the GraphQL API. Irellevant or unusable fields were removed.

- All the other benefits of a GraphQL API such as selecting specific fields, type checking, self documenting schema, and getting all your data in 1 request

## Travel Planner

I'm currently designing a travel planner using A* search. More details will be added when it's complete.
The graph data representing the transit system can be found [here](./src/astar/GRAPH.json). Below is a visualization of the graph.

![graph](content/graph.png)

## Schema

The full schema can be found [here](./src/graphql/schema.ts).
I highly recommend taking at look at the schema using [GraphQL Voyager](https://apis.guru/graphql-voyager/) (to use it you need to copy paste in the schema).
This is a simplified diagram showing the relationship between types:

![schema diagram](content/diagram.png)

## Example

### Query

```gql
query {
  userGet {
    email
    favouriteStops {
      id
      stop {
        name
      }
      stopRoutes {
        id
        headsign
        number
        nextStopTime {
          time {
            string
          }
        }
        route {
          colour
          textColour
        }
      }
    }
  }
}
```

### Result

``` json
{
  "data": {
    "userGet": {
      "email": "test@test.com",
      "favouriteStops": [
        {
          "id": "5e7c3e49f9e04b4294e318b8",
          "stop": {
            "name": "HURDMAN D"
          },
          "stopRoutes": [
            {
              "id": "AL05040-313",
              "headsign": "St-Laurent",
              "number": "40",
              "nextStopTime": {
                "time": {
                  "string": "12:57"
                }
              },
              "route": {
                "colour": "D74100",
                "textColour": "FFFFFF"
              }
            },
            {
              "id": "AL05046-313",
              "headsign": "Hurdman",
              "number": "46",
              "nextStopTime": {
                "time": {
                  "string": "13:09"
                }
              },
              "route": {
                "colour": "6E6E70",
                "textColour": "FFFFFF"
              }
            }
          ]
        },
        {
          "id": "5e7c46b2f9e04b4294e318b9",
          "stop": {
            "name": "ELMVALE MALL STOP"
          },
          "stopRoutes": [
            {
              "id": "AF94048-313",
              "headsign": "Elmvale",
              "number": "48",
              "nextStopTime": {
                "time": {
                  "string": "12:57"
                }
              },
              "route": {
                "colour": "6E6E70",
                "textColour": "FFFFFF"
              }
            },
            {
              "id": "AF94049-313",
              "headsign": "Elmvale",
              "number": "49",
              "nextStopTime": {
                "time": {
                  "string": "13:27"
                }
              },
              "route": {
                "colour": "6E6E70",
                "textColour": "FFFFFF"
              }
            },
            {
              "id": "AF94090-313",
              "headsign": "Greenboro",
              "number": "90",
              "nextStopTime": {
                "time": {
                  "string": "13:04"
                }
              },
              "route": {
                "colour": "D74100",
                "textColour": "FFFFFF"
              }
            }
          ]
        }
      ]
    }
  }
}
```

### Generated UI

(Different data but with the same format)

![example](content/ui.png)
