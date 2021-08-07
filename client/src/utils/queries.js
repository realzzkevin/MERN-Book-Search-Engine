import { gql } from '@apollo/client';

export const GET_ME = gql`
    query User {
        _id
        username
        email
        bookCount
        password
        saveBooks {
            _id
            authors
            description
            bookId
            image
            link
            title
        }
    }
`;
