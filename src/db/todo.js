const Todo = require('../models/todo');

module.exports = (pool) => {
    const db = {};

    // getParentOfTodo(todoId: todoId) -> listId: listId
    db.getParentOfTodo = async (todoId) => {
        const result = await pool.query(
            'SELECT parent FROM Todos WHERE id = $1',
            [todoId]
        );

        return result;
    };

    // createNewTodo(newTodo: Todo) -> Todo
    db.createNewTodo = async (newTodo) => {
        const result = await pool.query(
            'INSERT INTO Todos (parent,topic,body) VALUES ($1,$2, $3) RETURNING *',
            [newTodo.parent, newTodo.topic, newTodo.body]
        );
        return new Todo({ ...result.rows[0] });
    };

    // updateTodo(todoId: todoId, { parent, topic, body }: partial<Todo>) -> Todo
    db.updateTodo = async (todoId, { parent, topic, body }) => {
        let result;
        if (parent) {
            result = await pool.query(
                'UPDATE Todos SET parent=$2, topic=$3, body=$4 WHERE id=$1 RETURNING *',
                [todoId, parent, topic, body]
            );
        } else {
            result = await pool.query(
                'UPDATE Todos SET topic=$2, body=$3 WHERE id=$1 RETURNING *',
                [todoId, topic, body]
            );
        }

        return new Todo({ ...result.rows[0] });
    };

    // deleteTodo(todoId: todoId) -> bool
    db.deleteTodo = async (todoId) => {
        const result = await pool.query('DELETE FROM Todos WHERE id=$1', [
            todoId,
        ]);
        return result.rowCount > 0;
    };

    return db;
};
