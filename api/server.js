
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');


// Schema and Resolvers
const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');

// Middleware
const connect = require('connect');
const query = require('qs-middleware');
const authMiddleware = require('./middleware/auth');

// Make the Server
const path = '/graphql';
const app = connect();
const server = new ApolloServer({ typeDefs: schema, resolvers: resolvers });

// Connecting
app.use(query());
server.applyMiddleware({ app, path });


const start = async () => {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5ui2q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(uri, { useNewUrlParser: true });
    app.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    });
};

start();

