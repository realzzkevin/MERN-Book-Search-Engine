const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: 
        password: String!
        savedBooks: [Book]    
    }

    type Book {
        _id: ID!
        authors: [String]
        description: String!
        boodId: String!
        image: String
        link: String
        title: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {

    }

    type Mutation {

    }
`

module.exports = typeDefs;