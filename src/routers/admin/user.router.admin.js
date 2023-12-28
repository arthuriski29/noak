const usersRouter = require('express').Router();

const usersController = require('../../controllers/admin/user.controller.admin');

usersRouter.get('/', usersController.getAllUsers);
usersRouter.get('/:id', usersController.getOneUserById);

module.exports = usersRouter;