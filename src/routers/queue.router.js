const queueRouter = require('express').Router();
const queueController = require('../controllers/queue.controller');
// const authMiddleware = require('../middlewares/auth.middleware');


queueRouter.get('/now', queueController.getAllQueue); //list all patients user
// queueRouter.patch('/consult', queueController.updateConsultQueue); //start consultation

module.exports = queueRouter;