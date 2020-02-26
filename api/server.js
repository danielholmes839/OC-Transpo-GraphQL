const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(authMiddleware);
app.use('/graphql', cors(), graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true,
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-u99zs.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).
    then(() => {
        app.listen(3000);
        console.log('Beep Boop Listening on: http://localhost:3000/graphql');
    }).
    catch(err => {
        console.log(err);
    });


