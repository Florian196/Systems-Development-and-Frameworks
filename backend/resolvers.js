const jwt = require('jsonwebtoken');
const AuthenticationError = require('apollo-server-errors');
const {decryptedToken} = require('./jwtDecoder');
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
      todos: (object, params) => {
        const decrypted = decryptedToken(params.token);
        return todos;
    }
  },
    Mutation: {
        addToDo: (object, input) =>{
          const decrypted = decryptedToken(params.token);
          todos.push({
              title: input.title,
          });
        },
        deleteToDo: (object, input) =>{
          const decrypted = decryptedToken(params.token);
          todos.splice(input.index, 1);
        },
        updateToDo: (object, input) => {
          const decrypted = decryptedToken(params.token);
          todos[input.index].title = input.title;
        },
      loginUser: (object, params)  => {

        let user  = users.find(
          user => user.username === params.username );
        if(user !== undefined){
          throw new AuthenticationError(
            "Username undefined"
          );
        }

        if(user.password !== params.password){
          throw new AuthenticationError(
            "Wrong password"
          )
        }
        return {token : jwt.sign(user, "12345")};
      }
    }
  };


module.exports.resolvers = resolvers;

  