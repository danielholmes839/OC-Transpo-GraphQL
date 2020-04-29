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

## Examples

### Stop Search

Query

```gql
query {
  stopSearch(name:"pleasant park cavendish", limit: 2) {
    id
    name
    stopRoutes {
      headsign
      number
    }
  }
}
```

Result

```json
{
  "data": {
    "stopSearch": [
      {
        "id": "AG150",
        "name": "PLEASANT PARK / CAVENDISH",
        "stopRoutes": [
          {
            "headsign": "Hurdman",
            "number": "49"
          }
        ]
      },
      {
        "id": "AG160",
        "name": "PLEASANT PARK / CAVENDISH",
        "stopRoutes": [
          {
            "headsign": "Elmvale",
            "number": "49"
          }
        ]
      }
    ]
  }
}
```

### Travel Plan

Query

```gql
query {
  createTravelPlan(input:{
    start: "AK151",
    end: "CD998"
  }) {
    start {
      id
      name
    }
    end {
      id
      name
    }
    distance
    legs {
      distance
      instructions
      walk
      start {
        id
        name
      }
      end {
        name
        id
      }
    }
  }
}
```

Result

```json
{
  "data": {
    "createTravelPlan": {
      "start": {
        "id": "AK151",
        "name": "PLEASANT PARK / ARCH"
      },
      "end": {
        "id": "CD998",
        "name": "UOTTAWA O-TRAIN WEST / OUEST"
      },
      "distance": "7.2km",
      "legs": [
        {
          "distance": "5.5km",
          "instructions": "Take the 49 Hurdman from PLEASANT PARK / ARCH to HURDMAN A",
          "walk": false,
          "start": {
            "id": "AK151",
            "name": "PLEASANT PARK / ARCH"
          },
          "end": {
            "name": "HURDMAN A",
            "id": "AF910"
          }
        },
        {
          "distance": "24m",
          "instructions": "Walk from HURDMAN A to HURDMAN O-TRAIN WEST / OUEST",
          "walk": true,
          "start": {
            "id": "AF910",
            "name": "HURDMAN A"
          },
          "end": {
            "name": "HURDMAN O-TRAIN WEST / OUEST",
            "id": "AF990"
          }
        },
        {
          "distance": "1.7km",
          "instructions": "Take the 1 Tunney's Pasture from HURDMAN O-TRAIN WEST / OUEST to UOTTAWA O-TRAIN WEST / OUEST",
          "walk": false,
          "start": {
            "id": "AF990",
            "name": "HURDMAN O-TRAIN WEST / OUEST"
          },
          "end": {
            "name": "UOTTAWA O-TRAIN WEST / OUEST",
            "id": "CD998"
          }
        }
      ]
    }
  }
}
```

### User Login

Query

```gql
query {
  userLogin(email:"Daniel", password:"test") {
    token
    user {
      id
      email
      favouriteStops {
        id
        stop {
          name
        }
        stopRoutes {
          number
          headsign
          map
          busData {
            buses {
              headsign
              number
              direction
              hasGPS
              adjusted
              arrival {
                hour
                minute
              }
            }
            busCount
            busCountGPS
          }
          schedule {
            next {
              id
              time {
                hour
                minute
                int
              }
            }
          }
        }
      }
    }
  }
}
```

Result

```json
{
  "data": {
    "userLogin": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWU4YmE4MjdkMjA4N2E1ZjljZDExNTIwIiwiZW1haWwiOiJEYW5pZWwiLCJpYXQiOjE1ODgxMDYyMjcsImV4cCI6MTU4ODE5MjYyN30.7zLoQ3a_7oxu4n9QQplcAswseH1Y74uJtoHi8VhgoPA",
      "user": {
        "id": "5e8ba827d2087a5f9cd11520",
        "email": "Daniel",
        "favouriteStops": [
          {
            "id": "5e93cb424512fb0cd060a437",
            "stop": {
              "name": "HURDMAN B"
            },
            "stopRoutes": [
              {
                "number": "9",
                "headsign": "Hurdman",
                "map": "https://maps.googleapis.com/maps/api/staticmap?key=SUPERSECRETGOOGLEMAPSAPIKEYWHICHIREMOVED&center=45.412144,-75.66555699999999&size=600x400&markers=color:blue%7Csize:mid%7Clabel:S%7C45.412144,-75.66555699999999",
                "busData": {
                  "buses": [
                    {
                      "headsign": "Hurdman",
                      "number": "9",
                      "direction": 1,
                      "hasGPS": false,
                      "adjusted": false,
                      "arrival": {
                        "hour": 16,
                        "minute": 49
                      }
                    },
                    {
                      "headsign": "Hurdman",
                      "number": "9",
                      "direction": 1,
                      "hasGPS": false,
                      "adjusted": false,
                      "arrival": {
                        "hour": 17,
                        "minute": 49
                      }
                    },
                    {
                      "headsign": "Hurdman",
                      "number": "9",
                      "direction": 1,
                      "hasGPS": false,
                      "adjusted": false,
                      "arrival": {
                        "hour": 18,
                        "minute": 49
                      }
                    }
                  ],
                  "busCount": 3,
                  "busCountGPS": 0
                },
                "schedule": {
                  "next": {
                    "id": "69854135-JAN20-MARBRK20-Weekday-25AF920",
                    "time": {
                      "hour": 16,
                      "minute": 56,
                      "int": 1016
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```

### Prototype Dashboard

![example](content/ui.png)
