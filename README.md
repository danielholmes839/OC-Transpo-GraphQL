# GraphQL API for GTFS data

This repo is a GraphQL API for GTFS (General Transit Feed Specification) data. I'm currently not attempting to support every GTFS dataset only
the OC Transpo (Ottawa, Canada's transit system) dataset. It was created using apollo-express-server and MongoDB.
Eventually I will be building an entire web application around this API.

## Schema

The full schema can be found [here](./api/graphql/schema/index.js). The graph below shows the relationship between types:

![schema diagram](api/graphql/schema/diagram.png)

## Examples

### Getting stop data

#### Query

```gql

query {
  getStop(stop: "AF940"){
    _id
    name
    lon
    lat
    stopRoutes {
      _id
      route {
        _id
        name
      }
    }
  }

```

#### Result

```json
{
  "data": {
    "getStop": {
      "_id": "AF940",
      "name": "HURDMAN D",
      "lon": -75.666889,
      "lat": 45.412082,
      "stopRoutes": [
        {
          "_id": "AF94010-313",
          "route": {
            "_id": "10-313",
            "name": "10"
          }
        },
        {
          "_id": "AF940199-313",
          "route": {
            "_id": "199-313",
            "name": "199"
          }
        }
      ]
    }
  }
}
```

### Creating a New User

#### Mutation

```gql
mutation {
  createUser(email: "test@test.com", password: "test") {
    email
  }
}
```

#### First

```json
{
  "data": {
    "createUser": {
      "email": "test@test.com"
    }
  }
}
```

#### Second

Users cannot have the same email:

```json
{
  "errors": [
    {
      "message": "Email in use",
    }
  ],
  "data": {
    "createUser": null
  }
}
```

### Logging In

Logs in a user and returns a JSON Web Token that can be used
to access the user's favourite stops later.

#### Query

```gql

query {
  login(email: "test@test.com", password: "test") {
    token
    expiration
    user {
      _id
      email
      password
    }
  }
}

```

#### Result

```json

{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWU2YzM3MGJkZjMxM2IzNjNjNTJlYjcxIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNTg0MTUyNTEwLCJleHAiOjE1ODQxNTYxMTB9.ZTewAKAKcobjXcnIPh7i2lFnUBF03b6Nps5nozxKzas",
      "expiration": 1,
      "user": {
        "_id": "5e6c370bdf313b363c52eb71",
        "email": "test@test.com",
        "password": null
      }
    }
  }
}

```

### Adding Favourite Stops to User

#### Mutation

This mutation must be sent using the user's json web token

```gql
mutation {
  addFavouriteStop(favouriteStop: {
    stop: "AF940",
    stopRoutes: ["AF94049-313", "AF940199-313"]
  }) {
    user {
      email
    }
    stop {
      name
    }
    stopRoutes {
      route {
        name
      }
    }
  }
}
```

#### Result

```json
{
  "data": {
    "addFavouriteStop": {
      "user": {
        "email": "test@test.com"
      },
      "stop": {
        "name": "HURDMAN D"
      },
      "stopRoutes": [
        {
          "route": {
            "name": "199"
          }
        },
        {
          "route": {
            "name": "49"
          }
        }
      ]
    }
  }
}
```

### Getting a User

#### Query

This query must be sent using the user's json web token

```gql
query {
  getUser {
    email
    favouriteStops {
      _id
      stop {
        name
      }
      stopRoutes {
        _id
        route {
          name
        }
        stopTimes {
          time
          trip {
            service {
              saturday
              sunday
              monday
              exceptions {
                date {
                  yyyymmdd
                }
              }
            }
          }
        }
      }
    }
  }
}
```

#### Result

```json
{
  "data": {
    "getUser": {
      "email": "test@test.com",
      "favouriteStops": [
        {
          "_id": "5e6c3751df313b363c52eb72",
          "stop": {
            "name": "HURDMAN D"
          },
          "stopRoutes": [
            {
              "_id": "AF940199-313",
              "route": {
                "name": "199"
              },
              "stopTimes": [
                {
                  "time": "06:15:00",
                  "trip": {
                    "service": {
                      "saturday": false,
                      "sunday": false,
                      "monday": true,
                      "exceptions": []
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  }
}

```

### Search Stops

#### Query

```gql
query {
  searchStops(name: "Pleasant Arch", limit: 2) {
    name
    _id
    stopRoutes {
      route {
        name
      }
    }
  }
}
```

#### Result

``` json
{
  "data": {
    "searchStops": [
      {
        "name": "PLEASANT PARK / ARCH",
        "_id": "AK145",
        "stopRoutes": [
          {
            "route": {
              "name": "49"
            }
          }
        ]
      },
      {
        "name": "PLEASANT PARK / ARCH",
        "_id": "AK151",
        "stopRoutes": [
          {
            "route": {
              "name": "49"
            }
          }
        ]
      }
    ]
  }
}
```

## Prototype

Example of a UI where all data can be obtained from one GraphQL query:
![example](prototype/app_prototype/example.PNG)
