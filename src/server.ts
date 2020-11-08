import config from './config';
config(); // Fixes absolute imports and sets environment variables

import fs from 'fs';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';

// GraphQL schema, resolvers and middleware
import { resolvers, schema } from 'resolvers';
import context from './middleware';

const db = async () => {
    /* Connect to mongodb */
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5ui2q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
    try { await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }); }
    catch { console.log(`Couldn't connect mongoose to MongoDB`); }
}

const start = async (): Promise<void> => {
    /* Run the server  */
    const port = process.env.PORT || 3000;
    const server = new ApolloServer({
        context: context,
        typeDefs: schema,
        resolvers: resolvers,
        introspection: true,
        playground: true,    
    });

    await db();
    const { url } = await server.listen({ port });
    console.log(`🚀 Server ready at ${url}`);
}

start();
