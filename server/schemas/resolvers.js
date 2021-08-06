const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args) => {
            const user = null;
            const foundUser = await User.findOne({
                $or: [{ _id: user ? user._id : args.id }, { username: args.username }],
            })

            return foundUser;
        }
    },
    Mutation: {
        login: async (parent, args) => {
            const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });

            if (user) {
                const isPwCorrect = await user.isCorrectPassword(args.password);
                if (isPwCorrect) {
                    const token = signToken(user);

                    return { token, user };
                }
            }

            return {};
        },

        addUser: async ( parent, args ) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async ( parent, { user, body } ) => {
            const updateUser = await User.findOneAndUpdate(
                {_id: user.id},
                {$addToSet: { saveBooks: body}},
                {new: true, runValidators: true}
            );
            return updatedUser;
        },

        removeBook: async ( parent, { user, params } ) => {
            const updatedUser = await user.findOneAndUpdate(
                {_id: user._id},
                {$pull: { saveBooks: { bookId: params.bookId}}},
                {new: true}
            );
            return updatedUser;
        },
    }
};

module.exports = resolvers;
