const { ApolloServer, gql } = require('apollo-server');
const typeDefs = gql`

  type todos {
    title: String
    author: String
  }

  type Query {
    todos: [todos]
  }
`;

const todos = [
  {
    title: 'SDF - Task 3',
    done: 'false',
  },
  {
    title: 'SDF - Task 2',
    done: 'true',
  },
];

const resolvers = {
  Query: {
    todos: () => todos,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });


server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});