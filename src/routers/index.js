const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', (request, response) => {
  return response.json({
    success: true,
    message: 'Backend is running well'
  });
});

router.use('/admin', authMiddleware, require('./admin/index'));

router.use('/auth', require('./auth.router'));
router.use('/doctors', require('./doctors.router'));
router.use('/patients', require('./patients.router'));
router.use('/profile',authMiddleware, require('./profile.router'));
router.use('/queue', require('./queue.router'));

router.use('*', (request, response) => {
  return response.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

module.exports = router;