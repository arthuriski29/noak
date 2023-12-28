const adminAuthRouter = require('express').Router();

const adminAuthController = require('../../controllers/admin/auth.controller.admin');

adminAuthRouter.post('/register', adminAuthController.register);
// adminAuthRouter.post('/forgot-password', authController.forgotPassword);
// adminAuthRouter.post('/reset-password', ('resetPassword'), authController.resetPassword);

module.exports = adminAuthRouter;