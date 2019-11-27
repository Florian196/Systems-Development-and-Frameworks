const { gql } = require("apollo-server");

const typeDefs = gql`
  type todos {
    title: String
  }

  type Query {
    todos: [todos]
  }
  type Mutation {
      addToDo(title: String!): [todos]
      deleteToDo(index: Int!): [todos]
      updateToDo(title: String!, index: Int!): [todos]
  }
`;

module.exports.typeDefs = typeDefs;