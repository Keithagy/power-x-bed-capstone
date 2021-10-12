const express = require('express');
const Todo = require('../models/todo');

module.exports = (todoService) => {
    const router = express.Router();

    // POST: create new todo
    router.post('/', async (req, res) => {
        const { parent, topic, body } = req.body;

        const newTodo = new Todo({
            parent,
            topic,
            body,
            completed: false,
        });

        todoService
            .createNewTodo(newTodo)
            .then(() =>
                res
                    .status(201)
                    .send(
                        `New todo ${topic} successfully created in list ${parent}`
                    )
            )
            .catch((err) => res.status(err.status).send(err.message));
    });

    // PUT: update todo attributes
    router.put('/:todoId', async (req, res) => {
        const { parent, topic, body } = req.body;
        const { todoId } = req.params;

        if (!topic || (isNaN(parent) && !parent) || !body) {
            res.status(400).send('Bad request, topic, title and parent cannot be null.');
        }
        todoService
            .updateTodo(todoId, { parent, topic, body })
            .then(() =>
                res
                    .status(204)
                    .send(
                        `Todo ${todoId} successfully updated`
                    )
            )
            .catch((err) => res.status(err.status).send(err.message));
    });

    // DELETE: delete todo
    router.delete('/:todoId', async (req, res) => {
        const { todoId } = req.params;

        todoService
            .deleteTodo(todoId)
            .then(() =>
                res.status(204).send(`Todo ${todoId} successfully deleted`)
            )
            .catch((err) => res.status(err.status).send(err.message));
    });

    return router;
};
