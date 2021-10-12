module.exports = (db, todoService) => {
    const service = {};

    //getListIdsAccessibleToUser(uid: uid) -> []listId
    service.getListIdsAccessibleToUser = (uid) => {
        const listIds = await db.getListIdsAccessibleToUser(uid);
        if (!listIds) {
            // db call returned an error because invalid uid
            throw new Error(
                'ListService -> getListIdsAccessibleToUser: Invalid uid provided'
            );
        }

        return listIds;
    };

    //getListIdsCreatedByUser(uid: uid) -> []listId
    service.getListIdsCreatedByUser = (uid) => {
        const listIds = await db.getListIdsCreatedByUser(uid);

        if (!listIds) {
            // db call returned an error because invalid uid
            throw new Error(
                'ListService -> getListIdsCreatedByUser: Invalid uid provided'
            );
        }

        return listIds;
    };

    //getCreatorOf(parent: listId) -> uid
    service.getCreatorOf = (listId) => {
        const uidOfListCreator = await db.getCreatorOf(listId);

        if (!uidOfListCreator) {
            // db call returned an error because invalid listId
            throw new Error(
                'ListService -> getCreatorOf: Invalid listId provided'
            );
        }

        return uidOfListCreator;
    };

    //createNewList(newList: List) -> List
    service.createNewList = (newList) => {
        const confirmationEntity = await db.createNewList(newList);

        if (!confirmationEntity) {
            throw new Error(
                'ListService -> createNewList: Invalid list entity provided'
            );
        }

        return confirmationEntity
    };

    //getResolvedList(listId) -> List with array of Todo entities
    service.getResolvedList = (listId) => {
        const listEntity = await db.getListById(listId);
        const resolvedTodos = await todoService.resolveTodoReferences(
            listEntity.todos
        );
        return { ...listEntity, todos: resolvedTodos };
    };

    //changeListTitle(listId: listId, newTitle:string) -> string
    service.changeListTitle = (listId, newTitle) => {
        const confirmation = await db.changeListTitle(listId, newTitle);

        if (!confirmation) {
            throw new Error(
                'ListService -> changeListTitle: Invalid listId or newTitle provided'
            );
        }

        return confirmation
    };

    //deleteList(listId: listId) -> string
    service.deleteList = (listId) => {
        const confirmation = await db.deleteList(listId);
        return confirmation
    };

    return service;
};