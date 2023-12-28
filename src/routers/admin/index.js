const admin = require('express').Router();

admin.use('/auth', require('./auth.router.admin'));
admin.use('/users', require('./user.router.admin'));


module.exports = admin;
