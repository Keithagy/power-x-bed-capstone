module.exports = (db) => {
    const service = {};

    // getParentOfTodo(todoId: todoId) -> listId: listId
    service.getParentOfTodo = async (todoId) => {
        const parentListId = await db.getParentOfTodo(todoId);
        return parentListId;
    };

    // createNewTodo(newTodo: Todo) -> Todo
    service.createNewTodo = async (newTodo) => {
        const confirmationEntity = await db.createNewTodo(newTodo);

        if (!confirmationEntity) {
            throw new Error(
                'TodoService -> createNewTodo: Invalid todo entity provided'
            );
        }

        return confirmationEntity;
    };
    // updateTodo(todoId: todoId, { parent, topic, body }: partial<Todo>) -> Todo
    service.updateTodo = async (todoId, { parent, topic, body }) => {
        const confirmationEntity = await db.updateTodo(todoId, {
            parent,
            topic,
            body,
        });

        if (!confirmationEntity) {
            throw new Error(
                'TodoService -> updateTodo: Invalid todoId or newDetails provided'
            );
        }

        return confirmationEntity;
    };

    // deleteTodo(todoId: todoId) -> bool
    service.deleteTodo = async (todoId) => {
        const confirmation = await db.deleteTodo(todoId);
        return confirmation;
    };

    // service.resolveTodoReferences = async (todoIdList) => {
    //     if (todoIdList.length <= 0) {
    //         return [];
    //     }

    //     const resolvedTodos = todoIdList.map(async (todoId) => {
    //         const todo = await db.getTodo(todoId);
    //         return todo;
    //     });

    //     return resolvedTodos;
    // };

    return service;
};
