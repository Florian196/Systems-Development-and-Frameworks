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
        todos: isAuthenticated
    },
    Mutation: {
        addToDo: isAuthenticated,
        deleteToDo: isAuthenticated,
        updateToDo: isAuthenticated,
        loginUser: allow
    },
    todos: isAuthenticated,
    User: isAuthenticated,
    AuthPayLoad: allow
    }

);

module.exports = permissions;