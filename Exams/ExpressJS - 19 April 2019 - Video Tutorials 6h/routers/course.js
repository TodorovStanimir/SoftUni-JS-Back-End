const express = require('express')
const router = express.Router();

const { auth, isAdmin } = require('../utils');
const controllers = require('../controllers');
const { courseValidator } = require('../utils/validators');

router.get('/', auth(false), controllers.course.get.home);

router.route('/all-courses')
    .get(auth(), controllers.course.get.allCourses)
    .post(auth(), controllers.course.post.searchCourses);


router.route('/create')
    .get(auth(), isAdmin, controllers.course.get.create)
    .post(auth(), isAdmin, courseValidator, controllers.course.post.create);

router.route('/edit/:id')
    .get(auth(), isAdmin, controllers.course.get.edit)
    .post(auth(), isAdmin, controllers.course.post.edit);

router.route('/addlecture/:id')
    .get(auth(), isAdmin, controllers.course.get.addLecture)
    .post(auth(), isAdmin, controllers.course.post.addLecture);

router.get('/details/:id', auth(), controllers.course.get.details);

router.post('/enroll/:id', auth(), controllers.course.post.enrollCourse);

router.get('/play-video/:id', auth(), controllers.course.get.playVideo);

router.get('/lectureDelete/:id', auth(), isAdmin, controllers.course.get.lectureDelete);

// router.get('/error', auth(), controllers.course.get.error);

router.get('*', auth(false), controllers.course.get.notFound);

module.exports = router;