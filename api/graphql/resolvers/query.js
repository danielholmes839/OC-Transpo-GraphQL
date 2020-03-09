const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/index');
const { populateRoute, populateStop, populateUser } = require('./populate');


const resolvers = {
    Query: {
        getRoute: async (root, args, context) => {
            return populateRoute(args);
        },

        getStop: async (root, args, context) => {
            return populateStop(args);
        },

        getUser: async (root, args, context) => {
            return populateUser(context);
        },

        login: async (root, { email, password }, context) => {
            // Get user
            const user = await User.findOne({ email: email });
            if (!user) { throw new Error('User does not exist'); }

            // Check password
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) { throw new Error('Incorrect password'); }

            // Create the token
            const token = jwt.sign(
                {
                    user: user._id,
                    email: user.email
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: '1h'
                }
            );

            return {
                user: populateUser({ user }),
                token: token,
                expiration: 1
            };
        },
    }
}

module.exports = resolvers;