# GraphQL API for GTFS data

GraphQL API for GTFS (General Transit Feed Specification) data created using Apollo-Express-Server.

## Schema

The full schema can be found [here](../api/graphql/schema/index.js). The graph below shows the relationship between types:

![schema diagram](api/graphql/schema/diagram.png)

## Example Queries

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
        ...
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

### User Login

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

## Prototype

Example of a UI where all data can be obtained from one GraphQL query:
![example](prototype/app_prototype/example.PNG)
