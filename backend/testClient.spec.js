const { createTestClient } = require('apollo-server-testing');

const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");

const { ApolloServer, gql } = require('apollo-server');

const { jwt } = require('jsonwebtoken');

const neo4j = require('neo4j-driver');

let token;
let query;
let mutate;

describe("ServerTest", () => {

  beforeAll(async () => {
    const neoDriver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'password')
    );

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      neoDriver
    });

    query = createTestClient(server).query;
    mutate = createTestClient(server).mutate;
  });

  it('test Login', async () => {
    const res = await mutate({ mutation: LOGIN_USER,
      variables: { username: "user1", password: "12345"}
    });
    token = res.data.loginUser.token;

    let res2 = await query({ query: GET_TODOS, 
      variables: {token: token}});
  
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
  }
`;

const GET_TODOS_PAGED = gql`
  query ($token: String!) {
    todos(token: $token, first: 1, offset: 1) {
      title
    }
  }
`;

const GET_TODOS_ORDERED = gql`
  query ($token: String!) {
    todos(token: $token, orderBy: text_asc) {
      title
    }
  }
`;

const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
      loginUser(username: $username, password: $password){
        token
      }
  }`;
