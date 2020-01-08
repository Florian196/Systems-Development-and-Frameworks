const { gql } = require("apollo-server");


const typeDefs = gql`
  type movie {
    title: String
    length: Int
  }

  type Query {
    movieList: [movie]
    users: [User]
  }
  type User {
    name: String!
    password: String!
    id: Int
  }
  type Mutation {
      addMovie(title: String! , length: Int!): [movie]
      deleteMovie(index: Int!): movie
      updateMovie(title: String!, length: Int!, index: Int!): [movie]
      loginUser(username: String!, password: String!): AuthPayLoad!  
  }
  type AuthPayLoad {
    token: String!
  }
`;

module.exports.typeDefs = typeDefs;