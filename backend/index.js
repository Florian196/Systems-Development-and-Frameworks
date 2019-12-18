const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./typeDefs');
//const { resolvers } = require('./resolvers');
const { makeAugmentedSchema } = require('neo4j-graphql-js');
const schema = makeAugmentedSchema ({ typeDefs });
const neo4j = require('neo4j-driver');

const neoDriver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
);

const server = new ApolloServer({ 
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    return {
      token: token || "",
      neoDriver
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});