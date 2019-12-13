const { neo4jgraphql } =  require ('neo4j-graphql-js');

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-errors');
const decryptedToken = require('./jwtDecoder');

const todos = [
    {
      title: 'SDF - Task 3',
    },
    {
      title: 'SDF - Task 2',
    },
  ];
  const users = [
    {
      username: "user1",
      password: "12345"
    },
    {
      username: "user2",
      password: "54321"
    }
  ];

const resolvers = {
    Query: {
      todos: (object, params, ctx, resolveInfo) => {
        const decrypted = decryptedToken(params.token);
        return neo4jgraphql(object, params, ctx, resolveInfo);
    }
  },
    Mutation: {
      addToDo: (object, input) =>{
        const decrypted = decryptedToken(input.token);
        todos.push({
            title: input.title,
        });
      },
      deleteToDo: (object, input) =>{
        const decrypted = decryptedToken(input.token);
        todos.splice(input.index, 1);
      },
      updateToDo: (object, input) => {
        const decrypted = decryptedToken(input.token);
        todos[input.index].title = input.title;
      },
      loginUser: (object, params)  => {
        const{ username, password} = params;
        let theUser  = users.find(
          user => user.username === username );
        if(theUser === undefined){
          throw new AuthenticationError(
            "Username undefined"
          );
        }
        if(theUser.password !== password){
          throw new AuthenticationError(
            "Wrong password"
          )
        }
        return {token : jwt.sign(theUser, "12345")};
      }
    }
  };

module.exports.resolvers = resolvers;

  