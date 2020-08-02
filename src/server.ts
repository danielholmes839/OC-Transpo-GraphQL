import config from './config';
config();

// GraphQL server code
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server';
import schema from 'api/schema';
import resolvers from 'api/resolvers';
import { middleware } from './middleware';


const port = process.env.PORT || 3000;

const connect_db = async () => {
    /* Connect to mongodb */
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5ui2q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    }
    catch {
        console.log(`Couldn't connect mongoose to MongoDB`);
    }
}
const start = async (): Promise<void> => {
    /* Development Config  */
    const server = new ApolloServer({
        typeDefs: schema,
        resolvers: resolvers,
        context: middleware,
        introspection: true,
        playground: true,
    });

    await connect_db();
    const { url } = await server.listen({ port });
    console.log(`🚀  Server ready at ${url}`);
}

start();
