const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int!
        password: String!
        savedBooks: [Book]    
    }

    type Book {
        _id: ID!
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User!
    }

    input bookInput {
        authors: [String],
        bookId: String!,
        description: String
        image: String,
        title: String!,
        link: String,
    }
    type Mutation {
        login(
            email: String!,
            password: String!
        ): Auth
        addUser(
            username: String!,
            email: String!,
            password: String!
        ): Auth
        saveBook( bookData: bookInput ): User
        removeBook (bookId: String!):  User
    }
`

module.exports = typeDefs;