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





## Prototype

Example of a UI where all data can be obtained from one GraphQL query:
![example](prototype/app_prototype/example.PNG)
