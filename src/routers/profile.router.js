const profileRouter = require('express').Router();
const profileController = require('../controllers/profile.controller');
// const authMiddleware = require('../middlewares/auth.middleware');


profileRouter.get('/:id', profileController.getMyProfile);
// profileRouter.get('/available', profileController.getAllDoctorsAvailable);
// profileRouter.patch('/', authMiddleware, profileController.updateDoctors);

module.exports = profileRouter;