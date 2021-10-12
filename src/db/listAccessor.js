module.exports = (pool) => {
    const db = {};

    db.addAccessor = async (listId, uid) => {
        const result = await pool.query(
            'INSERT INTO AccessibleTo (listId,accesibleTo) VALUES ($1,$2) RETURNING *',
            [listId, uid]
        );

        if (result && result.rows[0]) {
            const accessorIds = await pool.query(
                'SELECT accesibleTo FROM AccessibleTo WHERE listId = $1',
                [listId]
            );
            return accessorIds;
        }

        return null;
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
        const result = await pool.query('SELECT * FROM Lists WHERE id = $1', [
            listId,
        ]);

        return new List({ ...result.rows[0] });
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
