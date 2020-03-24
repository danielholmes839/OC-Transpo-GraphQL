const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User, Stop, Route } = require('../../models/index');
const { populateOne, populateUser } = require('./helpers');


const resolvers = {
    Query: {
        routeGet: async (root, { route }, context) => {
            return populateOne(route, Route);
        },

        stopGet: async (root, { stop }, context) => {
            return populateOne(stop, Stop);
        },

        stopSearch: async (root, { name, limit }, context) => {
            return await Stop.find(
                { $text: { $search: name } },
                { score: { $meta: "textScore" } }
            ).sort({ "score": { "$meta": "textScore" } }).limit(limit);
        },

        userGet: async (parent, args, { user, authenticated }) => {
            if (!authenticated) {
                throw new Error('Unauthenticated Request');
            }
            return await populateUser(user);

        },

        userLogin: async (root, { email, password }, context) => {
            // Get user
            const user = await User.findOne({ email: email });
            if (!user) { throw new Error('User does not exist'); }

            // Check password
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) { throw new Error('Incorrect password'); }

            // Create the token
            const token = jwt.sign({ user: user._id, email: user.email }, process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            return {
                user: async () => {
                    return await populateUser(user._id)
                },
                token: token,
                expiration: 1
            };
        },
    }
}

module.exports = resolvers;