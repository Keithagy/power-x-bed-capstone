module.exports = (db) => {
    const service = {};

    // getParentOfTodo(todoId: todoId) -> listId: listId
    service.getParentOfTodo = (todoId) => {
        const parentListId = await db.getParentOfTodo(todoId);
        return parentListId;
    };

    // createNewTodo(newTodo: Todo) -> Todo
    service.createNewTodo = (newTodo) => {
        const confirmationEntity = await db.createNewTodo(newTodo);

        if (!confirmationEntity) {
            throw new Error(
                'TodoService -> createNewTodo: Invalid todo entity provided'
            );
        }

        return confirmationEntity;
    };
    // updateTodo(todoId: todoId, { parent, topic, body }: partial<Todo>) -> Todo
    service.updateTodo = (todoId, { parent, topic, body }) => {
        const confirmationEntity = await db.updateTodo(todoId, {
            parent,
            topic,
            body,
        });

        if (!confirmation) {
            throw new Error(
                'TodoService -> updateTodo: Invalid todoId or newDetails provided'
            );
        }

        return confirmationEntity;
    };

    // deleteTodo(todoId: todoId) -> bool
    service.deleteTodo = (todoId) => {
        const confirmation = await db.deleteTodo(todoId);
        return confirmation;
    };

    return service;
};
