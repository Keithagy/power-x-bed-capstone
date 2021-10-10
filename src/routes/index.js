const express = require('express');

module.exports = (authMiddleware, authService, permissions, listService, todoService) => {
    const router = express.Router();
    const {listPermissions, todoPermissions} = permissions

    router.get('/', (req, res, next) => {
        res.send('BED Capstone!');
    });

    // Auth
    router.use('/', require('./auth')(authService));

    // All routes from this point will use the auth middleware
    router.use(authMiddleware);

    // Different permission middlewares for each of the routes
    router.use('/lists', [listPermissions, require('./list')(listService)])
    router.use('/todos', [todoPermissions, require('./todo')(todoService)])

    return router;
};
