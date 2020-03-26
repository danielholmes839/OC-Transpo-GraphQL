const { FavouriteStop } = require('../../models/index');
const { populateMany, docId } = require('./loaders');

var userResolvers = {
    User: {
        id: docId,
        password: async(parent, args, context) => {
            return null;
        },
        favouriteStops: async ({ favouriteStops }, args, context) => {
            return await populateMany(favouriteStops, FavouriteStop);
        }
    }
};

module.exports = userResolvers;