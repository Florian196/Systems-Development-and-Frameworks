const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./typeDefs');
//const { resolvers } = require('./resolvers');
const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { v1 } = require('neo4j-driver');
const schema = makeAugmentedSchema ({ typeDefs });
const neo4j = v1.driver(
  'bolt://localhost:7687',
  v1.auth.basic('neo4j', 'password')
);

const server = new ApolloServer({ 
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    return {
      token: token || "",
      neo4j
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});