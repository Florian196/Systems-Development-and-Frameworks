const { gql } = require("apollo-server");


const typeDefs = gql`
  type todos {
    title: String
  }

  type Query {
    todos: [todos]
    users: [User]
  }
  type User {
    name: String!
    password: String!
    id: Int
  }
  type Mutation {
      addToDo(title: String!, token: String!): [todos]
      deleteToDo(index: Int!, token: String!): [todos]
      updateToDo(title: String!, index: Int!, token: String!): [todos]
      loginUser(username: String!, password: String!): AuthPayLoad!  
  }
  type AuthPayLoad {
    token: String!
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports.typeDefs = typeDefs;