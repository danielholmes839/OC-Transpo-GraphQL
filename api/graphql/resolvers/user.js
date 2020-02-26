const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Stop = require('../../models/stop');
const { transformUser, transformStop } = require('./merge');

var userResolvers = {
    getUsers: () => {
        return User.find().then(users => {
            return users.map(user => {
                return transformUser(user);
            });
        });
    },

    createUser: args => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User exists already.');
                }
                return bcrypt.hash(args.userInput.password, 12);
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(user => {
                return transformUser(user);
            })
            .catch(err => {
                throw err;
            });
    },

    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Incorrect password');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'secret key',
            { expiresIn: '1h' }
        );

        return {
            userId: user.id,
            token: token,
            expiration: 1
        };
    },

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
};

module.exports = userResolvers;