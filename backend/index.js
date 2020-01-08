const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { applyMiddleware} = require('graphql-middleware');
const { makeExecutableSchema } = require("graphql-tools");
const permissions  = require("./permissions");
const getContext = require('./context');

const schema = applyMiddleware(makeExecutableSchema({ typeDefs, resolvers}),permissions);

const server = new ApolloServer({ 
  schema,
  context: ({ req }) => {
    return getContext(req)
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});