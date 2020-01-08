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
      addToDo(title: String!): [todos]
      deleteToDo(index: Int!): todos
      updateToDo(title: String!, index: Int!): [todos]
      loginUser(username: String!, password: String!): AuthPayLoad!  
  }
  type AuthPayLoad {
    token: String!
  }
`;

module.exports.typeDefs = typeDefs;