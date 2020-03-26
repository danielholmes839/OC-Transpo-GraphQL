import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import FavouriteStops from './components/favouritestops';
import StopSearch from './components/stopsearch';
import Login from './components/login';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  request: (operation) => {
    const token = operation.setContext({
      headers: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWU3YzNlMmJmOWUwNGI0Mjk0ZTMxOGI3IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNTg1MjM2MDU4LCJleHAiOjE1ODUyNTQwNTh9.M1ZRGMpGoOssFmnpsYEaOrGGfWqegt31T5wk9x8dScM"
      }
    });
  }
});

const App = () => (

  <ApolloProvider client={client}>
    <div className="container my-5">
      <FavouriteStops />
      <StopSearch />
    </div>
  </ApolloProvider>
);

export default App;