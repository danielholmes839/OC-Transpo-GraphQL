const { populateFavouriteStops } = require('./populate')

var userResolvers = {
    User: {
        favouriteStops: populateFavouriteStops,
    }
};

module.exports = userResolvers;