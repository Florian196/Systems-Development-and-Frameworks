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
        //return neo4jgraphql(object, params, ctx, resolveInfo);
        return todos;
    }
  },
    Mutation: {
      addToDo: (object, input) =>{
        todos.push({
            title: input.title,
        });
        return todos;
      },
      deleteToDo: (object, input) =>{
        if(input.index >= todos.length){
          return null;
        }
        const delTodo = todos[input.index];
        todos.splice(input.index, 1);
        return delTodo;
      },
      updateToDo: (object, input) => {
        if(input.index >= todos.length){
          return null;
        }
        todos[input.index].title = input.title;
        return todos;
         
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
module.exports.users = users;

  