const List = require('../models/list');

module.exports = (pool) => {
    const db = {};

    db.getListIdsAccessibleToUser = async (uid) => {
        const result = await pool.query(
            'SELECT listId FROM AccessibleTo WHERE accesibleTo = $1',
            [uid]
        );

        return result;
    };

    db.getListIdsCreatedByUser = async (uid) => {
        const result = await pool.query(
            'SELECT id FROM Lists WHERE creator = $1',
            [uid]
        );

        return result;
    };

    db.getCreatorOf = async (listId) => {
        const result = await pool.query(
            'SELECT creator FROM Lists WHERE id = $1',
            [listId]
        );

        return result;
    };

    db.createNewList = async (newList) => {
        const result = await pool.query(
            'INSERT INTO Lists (creator,title) VALUES ($1,$2) RETURNING *',
            [newList.creator, newList.title]
        );
        return new List({ ...result.rows[0] });
    };

    db.getListById = async (listId) => {
        const listInfo = await pool.query('SELECT * FROM Lists WHERE id = $1', [
            listId,
        ]);

        const todosForList = await pool.query(
            'SELECT * FROM Todos WHERE parent = $1',
            [listId]
        );
        const listAccessibleTo = await pool.query(
            'SELECT * FROM AccessibleTo WHERE listId = $1',
            [listId]
        );

        return new List({
            ...listInfo.rows[0],
            todos: todosForList.rows.map((todo) => ({
                todoId: todo.id,
                topic: todo.topic,
                body: todo.body,
                completed: todo.completed,
            })),
            accessibleTo: listAccessibleTo.rows.map(ele=>ele.accesibleto),
        });
    };

    db.changeListTitle = async (listId, newTitle) => {
        const result = await pool.query(
            'UPDATE Lists SET title=$2 WHERE id=$1 RETURNING *',
            [listId, newTitle]
        );
        return new List({ ...result.rows[0] });
    };

    db.deleteList = async (listId) => {
        const result = await pool.query('DELETE FROM Lists WHERE id=$1', [
            listId,
        ]);
        return result.rowCount > 0;
    };

    return db;
};
