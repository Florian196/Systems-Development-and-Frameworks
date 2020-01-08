const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server');

const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const permissions  = require("./permissions");
const { applyMiddleware} = require('graphql-middleware');
const { makeExecutableSchema } = require("graphql-tools");
const decryptedToken = require('./jwtDecoder');
const getContext = require('./context');

const schema = applyMiddleware(makeExecutableSchema({ typeDefs, resolvers}),permissions);


function getTestApolloServer(req) {
  return new ApolloServer({
      schema, context: () => {
          return getContext(req);
      }
  })
}

let TestServer = getTestApolloServer();
let TestClient = createTestClient(TestServer);
let query = TestClient.query;
let mutate = TestClient.mutate;

const ADD_NEW_TODO = gql`
  mutation addToDo($title: String!){
    addToDo(title: $title){
      title
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteToDo($index: Int!){
    deleteToDo(index: $index){
      title
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateToDo($title: String!, $index: Int!){
    updateToDo(title: $title, index: $index){
      title
    }
  }
`;


const GET_TODOS = gql`
  query{
    todos{
      title 	
    }
  }
`;

const GET_TODOS_PAGED = gql`
  query {
    todos(first: 1, offset: 1){
      title
    }
  }
`;

const GET_TODOS_ORDERED = gql`
  query {
    todos(orderBy: text_asc){
      title
    }
  }
`;

const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!){
    loginUser(username: $username, password: $password){
      token
    }
  }
`;

describe("Test Server with Login", () => {
  beforeAll(async () => {
    const result = await mutate({
      mutation: LOGIN_USER,
      variables: {
        username: "user1",
        password: "12345"
      }
    });
    let req = new Map();
    req.set("Authorization", result.data.loginUser.token);
    TestServer = getTestApolloServer(req);
    TestClient = createTestClient(TestServer);
    query = TestClient.query;
    mutate = TestClient.mutate;
  });

  afterAll(async ()=> {
    TestServer = getTestApolloServer();
    TestClient = createTestClient(TestServer);
    query = TestClient.query;
    mutate = TestClient.mutate;
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
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject(
      {
        "addToDo": [
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
    );
  });

  it('delete todo', async() => {
    const res = await mutate({ mutation: DELETE_TODO,
      variables: { index: 2}
    });
    expect(res.data.deleteToDo).toMatchObject(
      {
        "title": "new todo title",
      }
    );
  });

  it('delete todo with wrong index', async() => {
    const res = await mutate({ mutation: DELETE_TODO,
      variables: { index: 200}
    });
    expect(res.data.deleteToDo).toBe(null);
  });

  it('update todo', async() => {
    const res = await mutate({ mutation: UPDATE_TODO,
      variables: {  title: "updated todo title", index: 1}
    });
    expect(res.data).toMatchObject(
      {
        "updateToDo": [
          {
            "title": "SDF - Task 3",
          },
          {
            "title": "updated todo title",
          }
        ]
      }
    );
    
  });

  it('update todo with wrong index', async() => {
    const res = await mutate({ mutation: UPDATE_TODO,
      variables: {  title: "updated todo title", index: 200}
    });
    expect(res.data.updateToDo).toBe(null);
  });

});

describe("Test Server without Login", () => {
  beforeAll(async () => {
    let req = new Map();
    req.set("Authorization", "");
    TestServer = getTestApolloServer(req);
    TestClient = createTestClient(TestServer);
    query = TestClient.query;
    mutate = TestClient.mutate;
  });

  afterAll(async ()=> {
    TestServer = getTestApolloServer();
    TestClient = createTestClient(TestServer);
    query = TestClient.query;
    mutate = TestClient.mutate;
  });

  it('get all todos fails, user no JWT', async () => {
    const res = await query({ query: GET_TODOS});
    expect(res.errors[0].message).toBe("Not Authorised!");
  });

  it('user login', async() => {
    const result = await mutate({
      mutation: LOGIN_USER,
      variables: {
        username: "user1",
        password: "12345"
      }
    });
    expect(result.errors).toBeUndefined();

    const token = result.data.loginUser.token;
    const user = decryptedToken(token);
    expect(user.username).toBe("user1");
    expect(user.password).toBe("12345");
  });

  it('wrong user login', async() => {
    const result = await mutate({
      mutation: LOGIN_USER,
      variables: {
        username: "userXYZ",
        password: "trash"
      }
    });
    expect(result.errors[0].message).toBe("Not Authorised!");
  });
});

