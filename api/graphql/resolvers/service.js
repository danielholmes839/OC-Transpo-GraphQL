const { ServiceException } = require('../../models/index');
const { populateMany } = require('../helpers/DataLoaders');

const resolvers = {
    Service: {
        id: (parent) => parent._id,
        exceptions: async ({ exceptions }, args, context) => {
            return await populateMany(exceptions, ServiceException);
        }
    }
}

module.exports = resolvers;