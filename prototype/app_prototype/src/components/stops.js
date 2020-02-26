import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Stop from './stop';

const query = gql`
  {
    getStops(stop_ids: ["EB920", "AF950", "AF990", "CD999"]) {
      name
      getRoutes {
        number
        name
        type
        colour
        text_colour
        getNextStopTime {
          time
        }
      }
    }
  }  
`;

const Stops = () => (
    <Query query={query}>
      {({ loading, error, data }) => {
        if (loading) return <p>Good things take time....</p>
        if (error) { return <p>{data}</p>}
        return <div>{data.getStops.map(stop => <Stop data={stop} />)}</div>
      }}
    </Query>
  )
 
export default Stops;