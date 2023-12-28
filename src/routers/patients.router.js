const patientsRouter = require('express').Router();
const patientsController = require('../controllers/patients.controller');
const authMiddleware = require('../middlewares/auth.middleware');


patientsRouter.get('/', patientsController.getAllPatients); //list all patients user
patientsRouter.patch('/consult', authMiddleware, patientsController.updateConsultQueue); //start consultation
// patientsRouter.get('/queue', patientsController.getAllDoctorsAvailable); // list all patients on queue
// patientsRouter.patch('/', authMiddleware, patientsController.updateDoctors);

module.exports = patientsRouter;