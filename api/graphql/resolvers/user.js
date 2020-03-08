const { populateFavouriteStops } = require('./populate')

/*
    addFavouriteStop: async (args, req) => {
        if (!req.authenticated) {
            throw new Error('Not authenticated');
        }

        let stop = await Stop.findOne({ _id: args.stopId });
        if (!stop) {
            throw new Error('Stop does not exist');
        }

        let user = await User.findOne({ _id: req.userId });
        if (!user) {
            throw new Error('User does not exist');
        }

        user.favouriteStops.push(stop._id);
        stop.users.push(req.userId);
        await stop.save();
        await user.save();
        return transformStop(stop);
    }
*/
var userResolvers = {
    favouriteStops: populateFavouriteStops,
};

module.exports = userResolvers;