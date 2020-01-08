const { neo4jgraphql } =  require ('neo4j-graphql-js');

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-errors');
const decryptedToken = require('./jwtDecoder');

const movieList = [
    {
      title: 'Predator',
      length: 120
    },
    {
      title: 'Frozen',
      length: 125
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
      movieList: (object, params, ctx, resolveInfo) => {
        return movieList;
    }
  },
    Mutation: {
      addMovie: (object, input) =>{
        movieList.push({
          title: input.title,
          length: input.length
        });
        return movieList;
      },
      deleteMovie: (object, input) =>{
        if(input.index >= movieList.length){
          return null;
        }
        const deletedMovie = movieList[input.index];
        movieList.splice(input.index, 1);
        return deletedMovie;
      },
      updateMovie: (object, input) => {
        if(input.index >= movieList.length){
          return null;
        }
        movieList[input.index].title = input.title;
        movieList[input.index].length = input.length;
        return movieList;
         
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

  