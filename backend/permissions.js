const {rule, shield, allow } =  require('graphql-shield');

const isAuthenticated = rule()(
    async (parent, args, context) => {
        if(context.user === undefined){
            return false;
        }
        return true;
});

const permissions = shield({
    Query: {
        movieList: isAuthenticated
    },
    Mutation: {
        addMovie: isAuthenticated,
        deleteMovie: isAuthenticated,
        updateMovie: isAuthenticated,
        loginUser: allow
    },
    movie: isAuthenticated,
    User: isAuthenticated,
    AuthPayLoad: allow
    }

);

module.exports = permissions;