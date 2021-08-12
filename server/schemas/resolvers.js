const { Book, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            console.log('this is query me and context'+context);
            if(context.user) {
                return User.findOne({ _id: context.user._id});//.populate('savedBooks');
            }
            throw new AuthenticationError('Cannot find a user with this id!');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            //const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            const user = await User.findOne({ email: email })

            if (!user) {
                throw new AuthenticationError("can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Wrong password");
            }
            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { bookData }, context) => {

            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }

            throw new AuthenticationError("Please login.");
        },

        removeBook: async (parent, { bookId }, context) => {
            
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("Please login");
        },
    }
};

module.exports = resolvers;
