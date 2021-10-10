module.exports = (listService, todoService) => {
    return (req, res, next) => {
        const { uid, method, body, params } = req;

        if (!params.todoId) {
            if (method !== 'POST') {
                return res.status(501).send('Not Implemented');
            }
            const listCreator = await listService.getCreatorOf(body.parent);
            if (listCreator !== uid) {
                return res.status(403).send('Forbidden');
            }
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
                    if (!listIdsCreatedByUser.includes(body.parent)) {
                        return res.status(403).send('Forbidden');
                    }
                }

            // If no parent specified in body, then fallthrough
            case 'DELETE':
                // checks for both DELETE and PUT
                // PUT: If body's parent field is indeed null, then todoId is being edited within the same parent
                // The parent of the todo must be a list created by that user
                if (
                    !listIdsCreatedByUser.includes(
                        todoService.getParentOfTodo(params.todoId)
                    )
                ) {
                    return res.status(403).send('Forbidden');
                }

            default:
                return res.status(501).send('Not Implemented');
        }
    };
};
