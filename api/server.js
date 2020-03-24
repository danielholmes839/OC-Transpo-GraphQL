const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// Schema and Resolvers
const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');

// Middleware
const userMiddleware = require('./middleware/auth');

// Make the Server
const app = express();
const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    context: userMiddleware
}).applyMiddleware({ app });


const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5ui2q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
app.listen({ port: 4000 }, () => { console.log(`Server ready at http://localhost:4000/graphql`); });
