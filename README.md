# GraphQL API for GTFS data

This is a [GraphQL API](https://graphql.org/) designed for [General Transit Feed Specification](https://developers.google.com/transit/gtfs) 
(GTFS) data from OC Transpo which is Ottawa's public transit system.
This API also wraps [OC Transpo's REST API](https://www.octranspo.com/en/plan-your-trip/travel-tools/developers/dev-doc)
for live bus data including arrival time and GPS data making it MUCH MUCH MUCH easier to use.
Built using [Apollo-Server](https://www.apollographql.com/docs/apollo-server/), TypeScript and MongoDB.

## Schema

The full schema can be found [here](./src/graphql/schema.ts).
I highly recommend taking at look at the schema using [Graphql Voyager](https://apis.guru/graphql-voyager/) (must copy paste schema).
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
