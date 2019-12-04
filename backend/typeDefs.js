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
      loginUser(data: UserLoginInput!): AuthPayLoad!  
    }
    input UserLoginInput {
      username: String!
      password: String!
    }
    type AuthPayLoad {
      token: String!
    }
`;

module.exports.typeDefs = typeDefs;