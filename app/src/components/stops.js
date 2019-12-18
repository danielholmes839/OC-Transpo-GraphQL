import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Stop from './stop';

const query = gql`
  {
    getStops(stop_ids: ["AF990", "AK145", "CD999", "AF950"]) {
      name
      getRoutes {
        number
        name
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