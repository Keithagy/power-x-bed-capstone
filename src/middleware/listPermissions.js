module.exports = (listService) => {
    return (req, res, next) => {
        const { uid, method, params } = req;

        if (!params.listId) {
            return next();
        }

        switch (method) {
            case 'GET':
                // req.uid must be in todoList.creator or todoList.accessibleTo
                const accessibleListIds =
                    await listService.getListIdsAccessibleToUser(uid);
                if (accessibleListIds.includes(params.listId)) {
                    req.accessibleListIds = accessibleListIds;
                    return next();
                }
                return res.status(403).send('Forbidden');
            case 'POST' || 'PUT' || 'DELETE':
                // req.uid must be in todoList.creator
                const createdListIds = await listService.getListIdsCreatedByUser(uid);
                if (createdListIds.includes(params.listId)) {
                    req.createdListIds = createdListIds;
                    return next();
                }
                return res.status(403).send('Forbidden');
            default:
                return res.status(501).send('Not Implemented');
        }
    };
};
