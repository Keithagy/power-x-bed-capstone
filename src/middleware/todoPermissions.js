const ListService = require('../services/list');
const db = require('../db');
(async () => await db.initialise())();

module.exports = (todoService) => {
    const listService = ListService(db, todoService);

    return async (req, res, next) => {
        const { uid, method, body, params } = req;
        console.log('todoPerm accessed');

        if (!params.todoId) {
            if (method !== 'POST') {
                return res.status(501).send('Not Implemented');
            }
            const listCreator = await listService.getCreatorOf(body.parent);
            if (listCreator.rows[0].creator !== uid) {
                return res.status(403).send('Forbidden');
            }
            console.log('todoPerm cleared; user is creator of resource');
            return next();
        }

        const listIdsCreatedByUser = await listService.getListIdsCreatedByUser(
            uid
        );
        switch (method) {
            case 'PUT':
                // PUT-specific check
                if (body.parent) {
                    // If body's parent field is not null, then todoId is being reassigned from one parent to another
                    // The destination parent of the todo must be a list created by that user
                    if (
                        !listIdsCreatedByUser
                            .map((ele) => ele.id)
                            .includes(Number(body.parent))
                    ) {
                        return res.status(403).send('Forbidden');
                    }
                }

            // If no parent specified in body, then fallthrough
            case 'DELETE':
                // checks for both DELETE and PUT
                // PUT: If body's parent field is indeed null, then todoId is being edited within the same parent
                // The parent of the todo must be a list created by that user
                const todoParentRaw = await todoService.getParentOfTodo(
                    params.todoId
                );
                const todoParent = todoParentRaw.rows[0].parent;
                if (
                    !listIdsCreatedByUser
                        .map((ele) => ele.id)
                        .includes(todoParent)
                ) {
                    return res.status(403).send('Forbidden');
                }
                console.log('todoPerm cleared; user is creator of resource');
                return next();
            default:
                return res.status(501).send('Not Implemented');
        }
    };
};
