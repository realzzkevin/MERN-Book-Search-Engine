const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user){
                return User.findOne({
                    $or:[{ _id: context.user ? user._id: context.user.id }, { username: context.username }],
                }).populate('books');
            }

            throw new AuthenticationError('Cannot find a user with this id!');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            //const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            const user = await User.findOne( { email: email} )

            if(!user) {
                throw new AuthenticationError("can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw){
                throw new AuthenticationError("Wrong password");
            }
            const token = signToken(user);
            return { token, user };
        },

        addUser: async ( parent, { username, email, password } ) => {
            const user = await User.create({ username, email, password});
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async ( parent, { user, body } ) => {
            const updateUser = await User.findOneAndUpdate(
                {_id: user._id},
                {$addToSet: { saveBooks: body}},
                {new: true, runValidators: true}
            );
            return updateUser;
        },

        removeBook: async ( parent, { user, params } ) => {
            /////////////////////////////////////////////
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
