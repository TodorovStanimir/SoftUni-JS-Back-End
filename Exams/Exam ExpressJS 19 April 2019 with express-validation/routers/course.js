const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utils/auth');
const { courseValidator } = require('../utils/validators');

router.get('/create', auth(), controllers.course.get.create);

router.post('/create', auth(), courseValidator, controllers.course.post.create);

router.get('/details/:id', auth(), controllers.course.get.details);

router.get('/edit/:id', auth(), controllers.course.get.edit);

router.post('/edit/:id', auth(), courseValidator, controllers.course.post.edit);

router.get('/enroll/:id', auth(), controllers.course.get.enroll);

router.get('/delete/:id', auth(), controllers.course.get.delete);

module.exports = router;