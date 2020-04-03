const { FavouriteStop } = require('../../models/index');
const { populateMany } = require('../helpers/DataLoaders');

var userResolvers = {
    User: {
        id: (parent) => parent._id,
        password: () => null,
        favouriteStops: async ({ favouriteStops }, args, context) => {
            return await populateMany(favouriteStops, FavouriteStop);
        }
    }
};

module.exports = userResolvers;