const express = require('express');

module.exports = (authService) => {
    const router = express.Router();

    router.post('/register', async (req, res, next) => {
        const { email, password } = req.body;
        const token = await authService.registerUser(email, password);
        if (token) {
            res.send({ token: token });
        } else {
            res.status(400).send(`Email ${email} already exists`);
        }
    });

    router.post('/login', async (req, res, next) => {
        const { email, password } = req.body;
        const token = await authService.loginUser(email, password);
        if (token) {
            res.send({ token: token });
        } else {
            res.status(400).send('Invalid login credentials');
        }
    });

    return router;
};
