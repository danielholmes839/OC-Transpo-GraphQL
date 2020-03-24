const { ServiceException } = require('../../models/index');
const { populateMany, docId } = require('./helpers');

const resolvers = {
    Service: {
        id: docId,
        exceptions: async ({ exceptions }, args, context) => {
            return await populateMany(exceptions, ServiceException);
        }
    }
}

module.exports = resolvers;