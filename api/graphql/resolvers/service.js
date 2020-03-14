const { populateServiceExceptions } = require('./populate');

const resolvers = {
    Service: {
        exceptions: populateServiceExceptions
    }
}

module.exports = resolvers;