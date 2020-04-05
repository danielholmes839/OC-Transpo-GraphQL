import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import FavouriteStops from './components/favouritestops';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  request: (operation) => {
    const token = operation.setContext({
      headers: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWU3ZDMyNzU4MjJjNTEyODg4YWJkMDE5IiwiZW1haWwiOiJEYW5pZWwiLCJpYXQiOjE1ODYxMDY3MzIsImV4cCI6MTU4NjEyNDczMn0.tdNLQTn9N_30ycz0Zks5h2Rc8JFB5guaYut1dEK4gwM"
      }
    });
  }
});

const App = () => (

  <ApolloProvider client={client}>
    <div className="container my-5">
      <FavouriteStops />
    </div>
  </ApolloProvider>
);

export default App;