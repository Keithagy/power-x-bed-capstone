const Todo = require('../models/todo');

module.exports = (pool) => {
    const db = {};

    // getParentOfTodo(todoId: todoId) -> listId: listId
    db.getParentOfTodo = (todoId) => {
        const result = await pool.query(
            'SELECT parent FROM Todos WHERE id = $1',
            [todoId]
        );

        return result;
    };

    // createNewTodo(newTodo: Todo) -> Todo
    db.createNewTodo = (newTodo) => {
        const result = await pool.query(
            'INSERT INTO Todos (parent,topic,body) VALUES ($1,$2, $3) RETURNING *',
            [newTodo.parent, newTodo.topic, newTodo.body]
        );
        return new Todo({ ...result.rows[0] });
    };

    // updateTodo(todoId: todoId, { parent, topic, body }: partial<Todo>) -> Todo
    db.updateTodo = (todoId, { parent, topic, body }) => {
        const result = await pool.query(
            'UPDATE Todos SET parent=$2, topic=$3, body=$4, WHERE id=$1 RETURNING *',
            [todoId, parent, topic, body]
        );
        return new Todo({ ...result.rows[0] });
    };

    // deleteTodo(todoId: todoId) -> bool
    db.deleteTodo = (todoId) => {
        const result = await pool.query('DELETE FROM Todos WHERE id=$1', [
            todoId,
        ]);
        return result.rowCount > 0;
    };

    return db;
};
