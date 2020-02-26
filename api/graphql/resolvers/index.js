const userResolvers = require('./user');
const stopResolvers = require('./stop');
const routeResolvers = require('./route');
const tripResolvers = require('./trip');

const rootResolvers = {
    ...userResolvers,
    ...stopResolvers,
    ...routeResolvers,
    ...tripResolvers
}

module.exports = rootResolvers;