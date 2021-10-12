const express = require('express');
const List = require('../models/list');

module.exports = (listService, amqpService) => {
    const router = express.Router();

    // GET with no listId: get all lists accessible to user
    router.get('/', async (req, res) => {
        const { uid } = req;
        const listIdsAccessibleToUser =
            await listService.getListIdsAccessibleToUser(uid);
        const resolvedLists = await Promise.all(
            listIdsAccessibleToUser.map((listId) =>
                listService.getResolvedList(listId)
            )
        );

        res.status(200).json(resolvedLists);
    });

    // GET with listId: get particular list
    router.get('/:listId', async (req, res) => {
        const { listId } = req.params;
        const resolvedList = await listService.getResolvedList(listId);

        res.status(200).json(resolvedList);
    });

    // POST with listId: add new user to be able to access the specified TODO list
    router.post('/:listId', async (req, res) => {
        const { listId } = req.params;
        const { newAccessEmail } = req.body;

        await amqpService.publishNewAccess(listId, newAccessEmail);
        res.status(200).send(
            `User with email ${newAccessEmail} has been queued for granting access to ${listId}`
        );
    });

    // POST: create new list
    router.post('/', async (req, res) => {
        const { title } = req.body;

        const newList = new List({
            creator: req.uid,
            accessibleTo: [],
            title,
            todos: [],
        });

        listService
            .createNewList(newList)
            .then(() =>
                res
                    .status(201)
                    .send(
                        `New list ${title} successfully created for user ${req.uid}`
                    )
            )
            .catch((err) => res.status(err.status).send(err.message));
    });

    // PUT: update list title
    router.put('/:listId', async (req, res) => {
        const { title } = req.body;
        const { listId } = req.params;

        if (!title) {
            res.status(400).send('Bad request, title cannot be null.');
        }
        listService
            .changeListTitle(listId, title)
            .then(() =>
                res
                    .status(204)
                    .send(
                        `List title successfully changed to ${title} for list ${listId}`
                    )
            )
            .catch((err) => res.status(err.status).send(err.message));
    });

    // DELETE: delete list
    router.delete('/:listId', async (req, res) => {
        const { listId } = req.params;

        listService
            .deleteList(listId)
            .then(
                (confirmation) =>
                    confirmation &&
                    res.status(204).send(`List ${listId} successfully deleted`)
            )
            .catch((err) => res.status(err.status).send(err.message));
    });

    return router;
};
