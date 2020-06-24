const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utils/auth')

router.get('/', auth(false), controllers.home.get.home);

router.post('/', auth(false), controllers.home.post.search);

module.exports = router;