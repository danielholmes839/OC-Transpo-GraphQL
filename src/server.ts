import config from './config';
config(); // Fixes absolute imports and sets environment variables

import { ApolloServer } from 'apollo-server';

// GraphQL schema, resolvers and middleware
import context from 'middleware';
import { connect } from 'db'
import { resolvers, schema } from 'resolvers';


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

    await connect();
    const { url } = await server.listen({ port });
    console.log(`🚀 Server ready at ${url}`);
}

start();
