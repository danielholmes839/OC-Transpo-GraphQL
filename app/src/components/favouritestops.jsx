import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import StopRoute from './stoproute';
import FavouriteStop from './favouritestop';

const query = gql`
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
            trip {
              service {
                wednesday
              }
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
`;

const FavouriteStops = () => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <p>Good things take time....</p>
      if (error) { return <p>Error</p> }

      return (
        <div>
          <h1>{data.userGet.email}</h1>
          {
            data.userGet.favouriteStops.map(favouriteStop => {
              return <FavouriteStop id={favouriteStop.id} key={favouriteStop.id} data={favouriteStop} />
            })
          }
        </div>
      )}}
  </Query>
)
export default FavouriteStops;