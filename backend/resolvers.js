const todos = [
    {
      title: 'SDF - Task 3',
    },
    {
      title: 'SDF - Task 2',
    },
  ];

const resolvers = {
    Query: {
      todos: () => todos,
    },
    Mutation: {
        addToDo: (object, input) =>{
            todos.push({
               title: input.title,
            });
        },
        deleteToDo: (object, input) =>{
            todos.splice(input.index, 1);
        },
        updateToDo: (object, input) => {
            todos[input.index].title = input.title;
        }
    }
  };


module.exports.resolvers = resolvers;
  