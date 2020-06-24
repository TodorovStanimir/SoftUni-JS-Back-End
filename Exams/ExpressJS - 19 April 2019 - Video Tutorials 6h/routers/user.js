const express = require('express')
const router = express.Router();

const controllers = require('../controllers');
const { userValidator, auth } = require('../utils');

router.route('/login')
    .get(auth(false), controllers.user.get.login)
    .post(auth(false), controllers.user.post.login);

router.route('/register')
    .get(auth(false), controllers.user.get.register)
    .post(auth(false), controllers.user.post.register);

router.post('/logout', controllers.user.post.logout);

module.exports = router;