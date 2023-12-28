const doctorRouter = require('express').Router();
const doctorController = require('../controllers/doctors.controller');
const authMiddleware = require('../middlewares/auth.middleware');


doctorRouter.get('/', doctorController.getAllDoctors);
doctorRouter.get('/available', doctorController.getAllDoctorsAvailable);
doctorRouter.patch('/', authMiddleware, doctorController.updateDoctors);

module.exports = doctorRouter;