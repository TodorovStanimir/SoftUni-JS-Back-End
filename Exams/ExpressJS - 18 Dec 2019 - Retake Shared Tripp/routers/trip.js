const express = require('express')
const router = express.Router();

const { auth } = require('../utils');
const controllers = require('../controllers');
const { tripValidator } = require('../utils/validators');

router.get('/', auth(false), controllers.trip.get.home);

router.get('/shared-tripps', auth(), controllers.trip.get.allTripps);

router.route('/offertrip')
    .get(auth(), controllers.trip.get.offerTrip)
    .post(auth(), tripValidator, controllers.trip.post.offerTrip);

router.route('/tripDetails/:id')
    .get(auth(), controllers.trip.get.tripDetails)

router.get('/joinTrip/:id', auth(), controllers.trip.get.joinTrip);

router.get('/deleteTrip/:id', auth(), controllers.trip.get.deleteTrip);

router.get('*', auth(false), controllers.trip.get.notFound);

module.exports = router;