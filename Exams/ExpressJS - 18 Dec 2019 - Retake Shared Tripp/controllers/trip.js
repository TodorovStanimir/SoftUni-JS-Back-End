const { validationResult } = require('express-validator');
const { Trip, User } = require('../models');

module.exports = {

    get: {
        home: async function (req, res, next) {
            if (res.locals.isLoggedIn) {
                res.redirect('/shared-tripps')
            } else {
                res.render('home.hbs');
            }

        },
        allTripps: async function (req, res, next) {

            try {
                const tripps = await Trip.find().lean();

                const hbsObject = {
                    pageTitle: 'Sharred Tripps Page',
                    tripps
                };
                res.render('sharedTripps.hbs', hbsObject);
            } catch (error) {
                const hbsObject = {
                    pageTitle: 'Not Found Page',
                    errors: [error.message],
                }
                res.render('404.hbs', hbsObject)
            }
        },
        offerTrip: function (req, res, next) {
            const hbsObject = {
                pageTitle: 'Offer new trip'
            }
            res.render('offerTrip.hbs', hbsObject);
        },
        tripDetails: async function (req, res, next) {
            try {
                const tripId = req.params.id;
                const userId = req.user._id;

                const trip = await Trip.findById(tripId).populate('buddies creator').lean();
                const isAlreadyJoined = trip.buddies.length > 0 ? trip.buddies.map(user => user._id.toString()).includes(userId.toString()) : false;
                trip.buddies = trip.buddies.length > 0 ? trip.buddies.map(buddy => buddy.email).join(', ') : '. . . . .'

                const hbsObject = {
                    pageTitle: 'Details Trip Page',
                    trip,
                    isAlreadyJoined,
                    isDriver: trip.creator._id.toString()===userId.toString(),
                    isThereFreeSeats: trip.seats > 0
                }
                res.render('tripDetails.hbs', hbsObject);
            } catch (error) {
                const hbsObject = {
                    pageTitle: 'Not Found Page',
                    errors: [error.message],
                }
                res.render('404.hbs', hbsObject)
            }

        },
        joinTrip: async function (req, res, next) {
            const tripId = req.params.id;
            const userId = req.user._id;

            try {
                await Trip.findByIdAndUpdate(tripId, { $inc: { seats: -1 }, $push: { buddies: userId } });
                await User.findByIdAndUpdate(userId, { $push: { trippsHistory: tripId } });
                res.redirect('/shared-tripps');
            } catch (error) {
                res.render('404', { errors: [error.message] })
            }
        },
        deleteTrip: async function (req, res, next) {
            try {
                const tripId = req.params.id;
                const userId = req.user._id;

                const deletedTrip = await Trip.findByIdAndDelete(tripId);
                await User.findByIdAndUpdate({ _id: userId }, { $pull: { trippsHistory: tripId } });
                res.redirect('/shared-tripps');
            } catch (error) {
                const hbsObject = {
                    pageTitle: 'Not Found Page',
                    errors: [error.message],
                }
                res.render('404.hbs', hbsObject)
            }
        },
        // error: function (req, res, next) {

        //     res.render('404.hbs');
        // },
        notFound: function (req, res, next) {
            const hbsObject = {
                pageTitle: 'Not Found Page',
                errors: [error.message],
            }
            res.render('404.hbs', hbsObject)
        }
    },

    post: {
        offerTrip: async function (req, res, next) {
            try {
                const { startAndEndPoint, dateTime, carImage, description } = req.body;
                const seats = +req.body.seats;

                const errors = validationResult(req);
                console.log(errors)

                if (!errors.isEmpty()) {

                    const hbsObject = {
                        startAndEndPoint, dateTime, carImage, description, seats,
                        errors: [errors.array()[0].msg]
                    };
                    return res.render('offerTrip.hbs', hbsObject)
                }

                const [startingPoint, endPoint] = startAndEndPoint.split(' - ');
                const [date, time] = dateTime.split(' - ');
                const userId = req.user._id;

                const newTrip = new Trip({ startingPoint, endPoint, date, time, carImage, description, seats, creator: userId });

                await newTrip.save();

                res.redirect('/shared-tripps');
            } catch (error) {
                const hbsObject = {
                    pageTitle: 'Not Found Page',
                    errors: [error.message],
                }
                res.render('404.hbs', hbsObject)
            }
        },
    }
}