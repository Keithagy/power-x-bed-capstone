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

    return db;
};
