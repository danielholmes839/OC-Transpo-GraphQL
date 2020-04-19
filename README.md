# General Transit Feed Specification GraphQL API

This is a [GraphQL API](https://graphql.org/) designed for [General Transit Feed Specification](https://developers.google.com/transit/gtfs)
(GTFS) data from OC Transpo which is Ottawa's public transit system.
In addition to being able to query GTFS data this API wraps [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc)
for live buses which includes arrival times and GPS data.

Built using [Apollo-Server](https://www.apollographql.com/docs/apollo-server/), TypeScript and MongoDB.

## OC Transpo's REST API

Wrapping [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc) with GraphQL provides many benefits:

- Documenting nullable fields. This is not done at all in OC Transpo's documentation. For example in OC Transpo's API GPS data for latitude, longitude and speed are
returned as strings which can also be empty strings. This in my opinion should be changed to return numbers/floats and null values instead. Which is easy to change with GraphQL.
The GraphQL schema also shows that GPS data can be nullable. To make it even easier for users I added another field "hasGPS" which returns a boolean value if that bus
has GPS data.

- The response structure is much easier to understand. While using OC Transpo's API I noticed certain fields could be a list of Objects or a single Object.
I think this is some sort of issue with their API being default XML and being converted to JSON before being sent but I'm not sure.
Another thing that I noticed was a field that only had one nested subfield which was very redundant.
I broke the response I was getting down into TypeScript types you can find them [here](./src/graphql/LiveBusData/types.ts).
GraphQL ensures the response structure is always consistent.

- Fields were renamed to be more accurate and to match what was being used in the rest of the GraphQL API. Irellevant or unusable fields were removed.

- Of course you also gain all the other benefits of a GraphQL API such selecting specific fields, type checking, self documenting schema, and getting all your data in 1 request

## Schema

The full schema can be found [here](./src/graphql/schema.ts).
I highly recommend taking at look at the schema using [Graphql Voyager](https://apis.guru/graphql-voyager/) (to use it you need to copy paste schema).
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
