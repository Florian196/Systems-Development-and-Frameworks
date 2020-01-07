const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { applyMiddleware} = require('graphql-middleware');
const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { makeExecutableSchema } = require("graphql-tools");
const permissions  = require("./permissions");
const neo4j = require('neo4j-driver');
const decryptedToken = require('./jwtDecoder');
const { users } = require('./resolvers');


//const schema = makeExecutableSchema ({ typeDefs, resolvers });
const schema = applyMiddleware(makeExecutableSchema({ typeDefs, resolvers}),permissions);




function getContext(req){
  const neoDriver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'password')
  );
  if (typeof req == "undefined" ) return {neoDriver};
  const authHeader = req.get('Authorization');
  if (typeof authHeader == "undefined" || authHeader === "") return {neoDriver};
  const token = authHeader.replace('Bearer ', '');
  const decrypted = decryptedToken(token);

  let user  = users.find(
    userx => userx.username === decrypted.username );

  if(user === undefined){
    return {neoDriver};
  }
  return {user,neoDriver};
}
const server = new ApolloServer({ 
  schema,
  context: ({ req }) => {
    return getContext(req)
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});