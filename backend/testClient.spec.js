const { createTestClient } = require('apollo-server-testing');

const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");

const { ApolloServer, gql } = require('apollo-server');

const { jwt } = require('jsonwebtoken');

let token;

describe("ServerTest", () => { 

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { query, mutate } = createTestClient(server);

  it('test Login', async () => {
    const res = await mutate({ mutation: LOGIN_USER,
      variables: { username: "user1", password: "12345"}
    });
    token = res.data.loginUser.token;

    let res2 = await query({ query: GET_TODOS, 
      variables: {token: token}})
  
    expect(res2).toMatchObject({
      "data": {
        "todos": [
          {
            "title": "SDF - Task 3",
          },
          {
            "title": "SDF - Task 2",
          }
        ]
      }
    })
  });

  it('get all todos', async () => {
    const res = await query({ query: GET_TODOS, variables: {token: token}
    });
    
    expect(res).toMatchObject(
      {
        "data": {
          "todos": [
            {
              "title": "SDF - Task 3",
            },
            {
              "title": "SDF - Task 2",
            }
          ]
        }
      }
    );
  });

  it('add new todo', async() => {
    const res = await mutate({ mutation: ADD_NEW_TODO,
    variables: { title: "new todo title", token: token }
    });
   const res2 = await query({ query: GET_TODOS, variables: {token: token}});
    
    expect(res2).toMatchObject(
      {
        "data": {
          "todos": [
            {
              "title": "SDF - Task 3",
            },
            {
              "title": "SDF - Task 2",
            },
            {
              "title": "new todo title"
            }
          ]
        }
      }
    );
    
  });

  it('delete todo', async() => {
    const res = await mutate({ mutation: DELETE_TODO,
    variables: { index: 2, token: token }
    });

   const res2 = await query({ query: GET_TODOS, variables: {token: token}});
    
    expect(res2).toMatchObject(
      {
        "data": {
          "todos": [
            {
              "title": "SDF - Task 3",
            },
            {
              "title": "SDF - Task 2",
            }
          ]
        }
      }
    );
    
  });

  it('update todo', async() => {
    const res = await mutate({ mutation: UPDATE_TODO,
    variables: {  title: "updated todo title", index: 1 , token: token}
    });

   const res2 = await query({ query: GET_TODOS, variables: {token: token}});
    
    expect(res2).toMatchObject(
      {
        "data": {
          "todos": [
            {
              "title": "SDF - Task 3",
            },
            {
              "title": "updated todo title",
            }
          ]
        }
      }
    );
    
  })


});

const ADD_NEW_TODO = gql`
  mutation addToDo($title: String!, $token: String!){
    addToDo(title: $title, token: $token){
      title
    }
  }`;

  const DELETE_TODO = gql`
  mutation deleteToDo($index: Int!, $token: String!){
    deleteToDo(index: $index, token: $token){
      title
    }
  }`;

  const UPDATE_TODO = gql`
  mutation updateToDo($title: String!, $index: Int!, $token: String!){
    updateToDo(title: $title, index: $index, token: $token){
      title
    }
  }`;


const GET_TODOS = gql`
  query($token: String!){
    todos(token: $token) {
      title 	
    }
}`;

const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
      loginUser(username: $username, password: $password){
        token
      }
  }`;
