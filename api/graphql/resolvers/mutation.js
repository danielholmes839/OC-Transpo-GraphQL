const bcrypt = require('bcryptjs');
const { User } = require('../../models/index');

const resolvers = {
    Mutation: {
        createUser: async (root, { email, password }, context) => {
            var user = await User.findOne({ email: email })
            if (user) { throw new Error("Email in use"); }

            user = new User({
                email: email,
                password: await bcrypt.hash(password, 12)
            });
            console.log(user);
            await user.save();
            console.log(user);
            user.password = null;
            return user
        }
    }
}

module.exports = resolvers;