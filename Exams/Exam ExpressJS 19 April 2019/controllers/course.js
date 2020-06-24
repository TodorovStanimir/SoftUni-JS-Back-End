const models = require('../models');
const config = require('../config/config');

module.exports = {

  get: {
    create: function (req, res, next) {

      const hbsObject = {
        pageTitle: 'Create Page',
        isLoggedIn: req.cookies[config.cookie] !== undefined,
        username: req.user ? req.user.username : ''
      }

      res.render('createCoursePage.hbs', hbsObject)
    },
    
    details: function (req, res, next) {

      const courseId = req.params.id;
      const userId = req.user.id;

      Promise.all(([models.Course.findById(courseId), models.User.findById(userId).populate('enrolledCourses')]))
        .then(([course, user]) => {

          const hbsObject = {
            pageTitle: 'Details Page',
            isLoggedIn: req.cookies[config.cookie] !== undefined,
            username: req.user !== undefined ? req.user.username : '',
            course: course,
            isCreator: course.creatorId.toString() === user.id,
            isEnrolled: user.enrolledCourses.find(c => c.id === course.id)
          };

          res.render('detailsCoursePage.hbs', hbsObject);
        })
        .catch(error => next(error))
    },

    enroll: function (req, res, next) {

      const courseId = req.params.id;
      const userId = req.user.id;

      Promise.all([
        models.Course.updateOne({ _id: courseId }, { $push: { usersEnrolled: userId } }),
        models.User.updateOne({ _id: userId }, { $push: { enrolledCourses: courseId } })])
        .then(([course, user]) => {
          res.redirect(`/course/details/${courseId}`);
        })
        .catch(next);
    },

    edit: function (req, res, next) {

      const courseId = req.params.id;

      models.Course.findById(courseId)
        .then(course => {

          const hbsObject = {
            pageTitle: 'Edit Page',
            isLoggedIn: req.cookies[config.cookie] !== undefined,
            username: req.user ? req.user.username : '',
            course: course
          };

          res.render('editCoursePage.hbs', hbsObject);
        })
        .catch(error => console.log(error))
    },

    delete: async function (req, res, next) {

      const courseId = req.params.id;
      const course = await models.Course.findById({ _id: courseId }).populate('usersEnrolled');

      course.usersEnrolled.map(async function (user) {
        await models.User.findByIdAndUpdate({ _id: user.id }, { $pull: { enrolledCourses: courseId } })
      });

      await models.Course.findByIdAndRemove({ _id: courseId });

      res.redirect('/home/');
    }
  },

  post: {
    create: function (req, res, next) {

      const { title, description, imageUrl } = req.body;
      const isPublic = req.body.isPublic === 'on';
      const creatorId = req.user.id;
      const createdAt = new Date();

      models.Course.create({ title, description, imageUrl, isPublic, creatorId, createdAt })
        .then(createdCourse => res.redirect('/home/'))
        .catch(err => {
          if (err.name === 'ValidationError') {

            const hbsObject = {
              pageTitle: 'Create Page',
              isLoggedIn: req.cookies[config.cookie] !== undefined,
              username: req.user ? req.user.username : '',
              course: { title, description, imageUrl, isPublic, creatorId },
              errors: err.errors
            };

            res.render('createCoursePage', hbsObject);
            return;
          };

          next(err);
        });
    },
    edit: function (req, res, next) {

      const courseId = req.params.id;
      const { title, description, imageUrl } = req.body;
      const isPublic = req.body.isPublic === 'on';

      models.Course.updateOne({ _id: courseId }, { title, description, imageUrl, isPublic }, { runValidators: true })
        .then(() => res.redirect('/home/'))
        .catch(err => {
          if (err.name === 'ValidationError') {

            const hbsObject = {
              pageTitle: 'Edit Page',
              isLoggedIn: req.cookies[config.cookie] !== undefined,
              username: req.user ? req.user.username : '',
              course: { title, description, imageUrl, isPublic, _id: courseId },
              errors: err.errors
            };

            res.render('editCoursePage.hbs', hbsObject);
            return;
          };

          next(err);
        });
    }
  }
}