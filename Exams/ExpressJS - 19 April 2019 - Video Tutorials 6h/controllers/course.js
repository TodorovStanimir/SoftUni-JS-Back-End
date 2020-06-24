const { validationResult } = require('express-validator');
const { Course, User, Lecture } = require('../models');
const course = require('../models/course');

module.exports = {

    get: {
        home: async function (req, res, next) {
            let courses = await Course.find({ isPublic: true }).populate('usersEnrolled').lean();

            courses = courses.sort((a, b) => b.usersEnrolled.length - a.usersEnrolled.length).slice(0, 3);

            const hbsObject = {
                courses
            };

            res.render('home.hbs', hbsObject);
        },
        allCourses: async function (req, res, next) {

            try {
                const courses = await Course.find({ isPublic: true }).populate('lectures').lean();

                const hbsObject = {
                    courses: courses.map(course => {
                        course.countLectures = course.lectures.length;
                        return course;
                    })
                };

                res.render('all-courses.hbs', hbsObject);
            } catch (error) {
                res.render('error', error);
            }
        },
        create: function (req, res, next) {

            res.render('create.hbs', { pageTitle: 'Create Page' });
        },
        addLecture: async function (req, res, next) {
            const courseId = req.params.id;

            const course = await Course.findById(courseId).populate('lectures').lean();

            course.countLectures = course.lectures.length;

            const hbsObject = {
                course
            };
            res.render('add-lecture', hbsObject);
        },
        details: async function (req, res, next) {
            try {
                const courseId = req.params.id;

                const userId = req.user ? req.user._id : '';

                const course = await Course.findById(courseId).populate('lectures').lean();

                if (!course) {
                    const error = new Error(`Could not find course #id ${courseId}.`);
                    throw error;
                }

                const user = await User.findById(userId).lean();

                if (!user) {
                    const error = new Error(`Could not find user #id ${userId}.`);
                    throw error;
                }

                const hbsObject = {
                    isEnroll: course.usersEnrolled.map(user => user._id.toString()).includes(userId.toString()),
                    course,
                    user
                };
                res.render('details', hbsObject);
            } catch (error) {
                res.render('error', { error })
            }
        },
        edit: async function (req, res, next) {
            try {
                const courseId = req.params.id;

                const course = await Course.findById(courseId).lean();

                res.render('edit', course);
            } catch (error) {
                res.render('error', { error })
            }

        },
        playVideo: async function (req, res, next) {

            const lectureId = req.params.id;

            try {
                const lecture = await Lecture.findById(lectureId).lean();

                const course = await Course.findOne({ lectures: { $in: lectureId } }).populate('lectures').lean();

                res.render('play-video.hbs', { course, lecture });
            } catch (error) {
                res.render('error', { error })
            }
        },
        lectureDelete: async function (req, res, next) {
            try {
                const lectureId = req.params.id;

                await Lecture.findByIdAndDelete(lectureId);
                await Course.findOneAndUpdate({ lectures: { $in: lectureId } }, { $pull: { lectures: lectureId } });

                res.redirect('/all-courses');
            } catch (error) {
                res.render('error', { error });
            }
        },
        error: function (req, res, next) {

            res.render('error.hbs', { pageTitle: 'Error Page' });
        },
        notFound: function (req, res, next) {

            res.render('404.hbs');
        }
    },

    post: {
        create: async function (req, res, next) {
            try {
                const { title, description, imageUrl } = req.body;
                const isPublic = req.body.isPublic === 'on';

                const errors = validationResult(req);

                if (!errors.isEmpty()) {

                    const hbsObject = {
                        pageTitle: 'Create Page',
                        title, description, imageUrl, isPublic,
                        errors: [errors.array()[0].msg]
                    };
                    return res.render('create.hbs', hbsObject)
                }

                const newCourse = new Course({ title, description, imageUrl, isPublic, lectures: [], usersEnrolled: [] });
                const courseId = newCourse._id;
                await newCourse.save();
                res.redirect('/all-courses');
            } catch (error) {
                res.render('error', { error });
            }
        },
        edit: async function (req, res, next) {
            try {
                const { title, description, imageUrl } = req.body;
                const isPublic = req.body.isPublic === 'on';
                const courseId = req.params.id;

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    course.description = description;
                    course.title = title;
                    course.imageUrl = imageUrl;
                    course.isPublic = isPublic;
                    course._id = articleId;

                    const hbsObject = {
                        article,
                        errors: [errors.array()[0].msg]
                    };
                    return res.render('edit.hbs', hbsObject)
                }
                await Course.findByIdAndUpdate({ _id: courseId }, { title, description, imageUrl, isPublic }, { runValidators: true });

                res.redirect('/all-courses');
            } catch (error) {
                res.render('error', { error });
            }
        },
        addLecture: async function (req, res, next) {
            const courseId = req.params.id;
            const { title, videoUrl } = req.body;
            try {
                const newLecture = new Lecture({ title, videoUrl });
                await newLecture.save();
                await Course.findByIdAndUpdate(courseId, { $push: { lectures: newLecture._id } });

                res.redirect('/all-courses');
            } catch (error) {
                res.render('error', { error });
            }

        },
        enrollCourse: async function (req, res, next) {
            const courseId = req.params.id;
            const userId = req.user._id;

            try {
                await Course.findByIdAndUpdate(courseId, { $push: { usersEnrolled: userId } });
                await User.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } });

                res.redirect(`/details/${courseId}`);
            } catch (error) {
                res.render('error', { error });
            }
        },
        searchCourses: async function (req, res, next) {
            try {
                const search = req.body.search;
                let courses = await Course.find({ title: { $regex: search, $options: 'gi' } }).populate('lectures').lean();
                corses = courses = courses.map(course => {
                    course.countLectures = course.lectures.length;
                    return course;
                })
                res.render('all-courses.hbs', { courses });
            } catch (error) {
                res.render('error', { error });
            }
        }
    }
}