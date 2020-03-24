const { FavouriteStop } = require('../../models/index');
const { populateMany, docId } = require('./loaders');

var userResolvers = {
    User: {
        id: docId,
        favouriteStops: async ({ favouriteStops }, args, context) => {
            return await populateMany(favouriteStops, FavouriteStop);
        }
    }
};

module.exports = userResolvers;