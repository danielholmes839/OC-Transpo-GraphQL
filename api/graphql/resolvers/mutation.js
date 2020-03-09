const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { User, FavouriteStop, Stop } = require('../../models/index');

const resolvers = {
    Mutation: {
        createUser: async (root, { email, password }, context) => {
            var user = await User.findOne({ email: email })
            if (user) { throw new Error("Email in use"); }

            user = new User({
                email: email,
                password: await bcrypt.hash(password, 12)
            });

            await user.save();
            user.password = null;
            return user
        },

        addFavouriteStop: async (root, { favouriteStop }, context) => {

            let stop = await Stop.findOne({ _id: favouriteStop.stop }); // Check that the stop exists
            if (!stop) { throw new Error('Stop does not exist'); }

            let user = await User.findOne({ _id: context.user });       // Check that the user exists 
            if (!user) { throw new Error('User does not exist'); }      // CHECKING THIS WILL PROBABLY CHANGE

            const favouriteStopDocument = new FavouriteStop(favouriteStop);
            await favouriteStopDocument.save();

            user.favouriteStops.push(favouriteStopDocument._id);
            await user.save();

            favouriteStop.user = context.user;
            return favouriteStop;
        }
    }
}

module.exports = resolvers;