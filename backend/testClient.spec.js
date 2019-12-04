const { createTestClient } = require('apollo-server-testing');

const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");

const { ApolloServer, gql } = require('apollo-server');

const { jwt } = require('jsonwebtoken');

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

  let token = res.data.loginUser.token;

  let res2 = await query({ query: GET_TODOS, 
    variables: {token}})

  });

  it('get all todos', async () => {
    const res = await query({ query: GET_TODOS});
    
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
    variables: { title: "new todo title" }
    });

   const res2 = await query({ query: GET_TODOS});
    
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
    variables: { index: 2 }
    });

   const res2 = await query({ query: GET_TODOS});
    
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
    variables: {  title: "updated todo title", index: 1 }
    });

   const res2 = await query({ query: GET_TODOS});
    
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
  mutation addToDo($title: String!){
    addToDo(title: $title){
      title
    }
  }`;

  const DELETE_TODO = gql`
  mutation deleteToDo($index: Int!){
    deleteToDo(index: $index){
      title
    }
  }`;

  const UPDATE_TODO = gql`
  mutation updateToDo($title: String!, $index: Int!){
    updateToDo(title: $title, index: $index){
      title
    }
  }`;


const GET_TODOS = gql`
{
  todos {
    title 	
  }
}`;

const LOGIN_USER = gql`
{
  mutation{
    loginUser(
      data: {
        $username: String!, 
        $password: String!}) {
      loginUser(data: { username: $username, password: $password}){
        token
      }}
  }
}`;
