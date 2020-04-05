import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import FavouriteStop from './favouritestop';

const query = gql`
  query {
    userGet {
      email
      favouriteStops {
        id
        stop {
          name
          code
        }
        stopRoutes {
          id
          headsign
          nextStopTimes(limit: 5) {
            time {
              string
            }
          }
          route {
            number
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
              return <FavouriteStop id={favouriteStop.id} key={favouriteStop.id} favouriteStop={favouriteStop} />
            })
          }
        </div>
      )}}
  </Query>
)
export default FavouriteStops;