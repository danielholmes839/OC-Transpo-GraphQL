# GraphQL API for GTFS data

This repo is a GraphQL API for GTFS (General Transit Feed Specification) data. I'm currently not attempting to support every GTFS dataset only
the OC Transpo (Ottawa, Canada's transit system) dataset. It was created using apollo-express-server and MongoDB.
Eventually I will be building an entire web application around this API.

## Schema

The full schema can be found [here](./api/graphql/schema/index.js). The graph below shows the relationship between types:

![schema diagram](content/diagram.png)

## Example Query

#### Query
Obtaining a users favourite stops and the time of each routes next trip

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

#### Result

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

## Example UI

This UI was created using the query above

![example](content/ui.png)
