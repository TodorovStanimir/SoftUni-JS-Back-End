const config = require('../config/config');
const models = require('../models');

module.exports = {

  get: {
    home: function (req, res, next) {

      const hbsObject = {
        pageTitle: 'Home Page',
        isLoggedIn: req.cookies[config.cookie] !== undefined,
        username: req.user ? req.user.username : '',
        courses: ''
      };

      models.Course.find()
        .then(courses => {
          hbsObject.courses = hbsObject.isLoggedIn
            ? courses.filter(course => course.isPublic).sort((a, b) => b.createdAt - a.createdAt).map(a => { a.isLoggedIn = hbsObject.isLoggedIn; return a; })
            : courses.filter(course => course.isPublic).sort((a, b) => b.usersEnrolled.length - a.usersEnrolled.length).slice(0, 3);
          res.render('homePage.hbs', hbsObject);
        })
        .catch(next);
    }
  },

  post: {
    search: function (req, res, next) {

      const search = req.body.search.toLowerCase();

      models.Course.find().then(courses => {
        const filteredcourses = courses.filter(course => course.title.toLowerCase().includes(search));

        const hbsObject = {
          pageTitle: 'Home Page',
          isLoggedIn: req.cookies[config.cookie] !== undefined,
          username: req.user ? req.user.username : '',
          courses: filteredcourses
        }
        
        res.render('homePage.hbs', hbsObject);
      }).catch(next)
    }
  }
}