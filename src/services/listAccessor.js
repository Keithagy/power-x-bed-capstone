module.exports = (db) => {
    const service = {};

    //addAccessor(listId: listId, uid: uid) -> bool
    service.addAccessor = async (listId, uid) => {
        const accessorIds = await db.addAccessor(listId, uid);
        if (!accessorIds) {
            // db call returned an error because invalid uid
            throw new Error(
                'listAccessorService -> addAccessor: Invalid listid or uid provided'
            );
        }

        return accessorIds;
    };

    return service;
};