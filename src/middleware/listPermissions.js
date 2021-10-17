module.exports = (listService) => {
    return async (req, res, next) => {
        const { uid, method, params } = req;
        console.log('listPerm accessed');

        if (!params.listId) {
            console.log(
                'listPerm cleared; no permissioned resource being accessed'
            );
            return next();
        }

        const createdListIdsRaw = await listService.getListIdsCreatedByUser(
            uid
        );

        const createdListIds = createdListIdsRaw.map(({ id }) => id);

        switch (method) {
            case 'GET':
                // req.uid must be in todoList.creator or todoList.accessibleTo
                const accessibleListIds =
                    await listService.getListIdsAccessibleToUser(uid);
                if (accessibleListIds.includes(params.listId)) {
                    req.accessibleListIds = accessibleListIds;
                    console.log(
                        'listPerm cleared; user is GETTING something accessible'
                    );
                    return next();
                }

                if (createdListIds.includes(Number(params.listId))) {
                    req.createdListIds = createdListIds;
                    console.log(
                        'listPerm cleared; user is GETTING something created'
                    );
                    return next();
                }
                return res.status(403).send('Forbidden');
            case 'POST':
            case 'PUT':
            case 'DELETE':
                // req.uid must be in todoList.creator
                if (createdListIds.includes(Number(params.listId))) {
                    req.createdListIds = createdListIds;
                    console.log(
                        'listPerm cleared; user is POST/PUT/DELETE-ing something created'
                    );
                    return next();
                }
                return res.status(403).send('Forbidden');
            default:
                return res.status(501).send('Not Implemented');
        }
    };
};
