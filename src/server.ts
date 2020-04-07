import * as express from 'express';
import { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connect } from 'mongoose'
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import context from './middleware/auth';

const app: Application = express();
const server = new ApolloServer({
    typeDefs, resolvers, context
}).applyMiddleware({ app, path: '/graphql' });

try {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5ui2q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
    connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
} catch {
    console.log('Couldnt connect to mongodb');
}

app.listen({ port: 3000 }, () => { console.log(`Server ready at http://localhost:3000/graphql`); });