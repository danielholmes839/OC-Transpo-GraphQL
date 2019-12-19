import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Stops from './components/stops';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  'uri': 'http://localhost:3000/graphql'
});

const App = () => (
  <ApolloProvider client={client}>
    <div className="container">
      <h1>Stops</h1>
      <Stops />
    </div>
  </ApolloProvider>
);
 
export default App;