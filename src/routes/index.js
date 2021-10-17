const express = require('express');

module.exports = (
    authMiddleware,
    authService,
    listService,
    todoService,
    amqpService
) => {
    const router = express.Router();

    router.get('/', (req, res, next) => {
        res.send('BED Capstone!');
    });

    // Auth
    router.use('/', require('./auth')(authService));

    // All routes from this point will use the auth middleware
    router.use(authMiddleware);

    // Different permission middlewares for each of the routes
    router.use('/', require('./list')(listService, amqpService));

    router.use('/', require('./todo')(todoService));
    return router;
};
