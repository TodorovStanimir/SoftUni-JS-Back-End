const router = require('express').Router();
const controllers = require('../controllers');
const { userValidator } = require('../utils/validators');

router.get('/login', controllers.user.get.login);

router.post('/login', controllers.user.post.login);

router.get('/register', controllers.user.get.register);

router.post('/register', userValidator, controllers.user.post.register);

router.get('/logout', controllers.user.get.logout);

module.exports = router;