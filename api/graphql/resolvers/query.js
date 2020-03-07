const { Route, Stop } = require('../../models/index');
const { populateOne, populateMany } = require('./populate');

const resolvers = {
    Query: {
        getRoute: async (root, args, context) => {
            return await populateOne(args._id, Route);
        },

        getStop: async (root, args, context) => {
            return await populateOne(args._id, Stop);
        },
    }
}

module.exports = resolvers;