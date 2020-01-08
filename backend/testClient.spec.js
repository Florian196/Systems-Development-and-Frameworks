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

const ADD_NEW_MOVIE = gql`
  mutation addMovie($title: String!, $length: Int!){
    addMovie(title: $title, length: $length){
      title,
      length
    }
  }
`;

const DELETE_MOVIE = gql`
  mutation deleteMovie($index: Int!){
    deleteMovie(index: $index){
      title,
      length
    }
  }
`;

const UPDATE_MOVIE = gql`
  mutation updateMovie($title: String!, $length: Int!, $index: Int!){
    updateMovie(title: $title, length: $length, index: $index){
      title,
      length
    }
  }
`;


const GET_MOVIE_LIST = gql`
  query{
    movieList {
      title,
      length
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

describe("Test server with valid login", () => {
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

  it('gets the movie list', async () => {
    const res = await query({ query: GET_MOVIE_LIST});
    expect(res).toMatchObject(
      {
        "data": {
          "movieList": [
            {
              "title": "Predator",
              "length": 120
            },
            {
              "title": "Frozen",
              "length": 125
            }
          ]
        }
      }
    );
  });

  it('adds a new movie', async() => {
    const res = await mutate({ mutation: ADD_NEW_MOVIE,
    variables: { title: "Es", length: 180 }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchObject(
      {
        "addMovie": [
          {
            "title": "Predator",
            "length": 120
          },
          {
            "title": "Frozen",
            "length": 125
          },
          {
            "title": "Es",
            "length": 180
          }
        ]
      }
    );
  });

  it('deletes a movie', async() => {
    const res = await mutate({ mutation: DELETE_MOVIE,
      variables: {index: 2}
    });
    expect(res.data.deleteMovie).toMatchObject(
      {
        "title": "Es",
        "length": 180
      }
    );
  });

  it('deletes a movie with an invalid index', async() => {
    const res = await mutate({ mutation: DELETE_MOVIE,
      variables: {index: 200}
    });
    expect(res.data.deleteMovie).toBe(null);
  });

  it('updates a movie', async() => {
    const res = await mutate({ mutation: UPDATE_MOVIE,
      variables: {title: "Alien vs Predator", length: 128, index: 0}
    });
    expect(res.data).toMatchObject(
      {
        "updateMovie": [
          {
            "title": "Alien vs Predator",
            "length": 128
          },
          {
            "title": "Frozen",
            "length": 125
          }
        ]
      }
    );
    
  });

  it('updates a movie with an invalid index', async() => {
    const res = await mutate({ mutation: UPDATE_MOVIE,
      variables: {title: "Alien vs Predator", length: 128, index: 200}
    });
    expect(res.data.updateMovie).toBe(null);
  });

});

describe("Test server without login", () => {
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

  it('fails to get movie list because the user has no JWT', async () => {
    const res = await query({ query: GET_MOVIE_LIST});
    expect(res.errors[0].message).toBe("Not Authorised!");
  });

  it('allows the server access for certain user', async() => {
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

